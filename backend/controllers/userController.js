import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import razorpay from 'razorpay';
import OtpModel from '../models/otpModel.js'
import otpGenerator from 'otp-generator'
import sendEmail from '../utils/sendEmail.js'
import sendSMS from '../utils/sendSMS.js'

// Constants
const SALT_ROUNDS = 12;
const OTP_EXPIRY_MINUTES = 5;
const OTP_TOKEN_EXPIRY = '10m';
const JWT_EXPIRY = '7d';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Validation utilities
const validateInput = {
  email: (email) => validator.isEmail(email),
  phone: (phone) => /^\+[1-9]\d{1,14}$/.test(phone),
  password: (password) => {
    // Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  },
  name: (name) => name && name.trim().length >= 2,
  otp: (otp) => /^\d{6}$/.test(otp)
};

const identifyInputType = (input) => {
  if (validateInput.email(input)) return 'email';
  if (validateInput.phone(input)) return 'phone';
  return null;
};

// Error response helper
const sendErrorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

// Success response helper
const sendSuccessResponse = (res, data = {}, message = 'Success') => {
  return res.json({ success: true, message, ...data });
};

// Rate limiting helper (you should use Redis in production)
const loginAttempts = new Map();

const checkRateLimit = (identifier) => {
  const attempts = loginAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
  
  if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
    const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    throw new Error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
  }
  
  return attempts;
};

const updateLoginAttempts = (identifier, success) => {
  if (success) {
    loginAttempts.delete(identifier);
  } else {
    const attempts = loginAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
    attempts.count += 1;
    
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + LOCKOUT_TIME;
    }
    
    loginAttempts.set(identifier, attempts);
  }
};

// Improved user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return sendErrorResponse(res, 'All fields are required');
    }

    if (!validateInput.name(name)) {
      return sendErrorResponse(res, 'Name must be at least 2 characters long');
    }

    if (!validateInput.email(email)) {
      return sendErrorResponse(res, 'Please enter a valid email address');
    }

    if (!validateInput.password(password)) {
      return sendErrorResponse(res, 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendErrorResponse(res, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const userData = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: JWT_EXPIRY }
    );

    sendSuccessResponse(res, { token }, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    sendErrorResponse(res, 'Registration failed. Please try again.', 500);
  }
};

//Function to send the otp
const sendOtp = async (req, res) => {
    const { identifier } = req.body

    console.log("=== SEND OTP DEBUG ===");
    console.log("Received identifier:", identifier);

    try {
        // Normalize identifier
        const normalizedIdentifier = identifier.toLowerCase().trim();

        // Check if user already exists
        const userExists = await userModel.findOne({ 
            $or: [{ email: normalizedIdentifier }, { phone: identifier.trim() }] 
        })
        if (userExists) {
            console.log("❌ User already exists");
            return res.json({ success: false, message: 'User already exists, please Login instead' })
        }

        // Check for recent OTP requests (prevent spam)
        const recentOtp = await OtpModel.findOne({
            identifier: normalizedIdentifier,
            type: 'signup',
            createdAt: { $gt: new Date(Date.now() - 60000) } // Within last minute
        })

        if (recentOtp) {
            return res.json({ success: false, message: 'OTP already sent. Please wait before requesting again.' })
        }

        // Clean up any old OTPs for this identifier
        await OtpModel.deleteMany({
            identifier: normalizedIdentifier,
            type: 'signup',
            $or: [
                { isUsed: true },
                { expiresAt: { $lt: new Date() } },
                { attempts: { $gte: 3 } }
            ]
        })

        // Generate OTP
        const otp = otpGenerator.generate(6, { 
            digits: true, 
            lowerCaseAlphabets: false, 
            upperCaseAlphabets: false, 
            specialChars: false 
        })

        console.log("Generated OTP:", otp);

        // Save OTP in DB (will be automatically hashed by pre-save hook)
        const otpRecord = await OtpModel.create({
            identifier: normalizedIdentifier,
            otp, // This will be hashed automatically
            type: 'signup',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        })

        console.log("OTP saved to DB with ID:", otpRecord._id);

        // Determine if email or phone
        const phoneRegex = /^\+[1-9]\d{1,14}$/
        const isPhone = phoneRegex.test(identifier.trim())

        // Send OTP
        try {
            if (isPhone) {
                console.log("Sending OTP via SMS");
                await sendSMS(identifier.trim(), `Your verification code is: ${otp}. Valid for 5 minutes.`)
            } else {
                console.log("Sending OTP via Email");
                await sendEmail(normalizedIdentifier, 'Verification Code', `Your verification code is: ${otp}. Valid for 5 minutes.`)
            }
        } catch (sendError) {
            console.error("Error sending OTP:", sendError);
            // Clean up the OTP record if sending fails
            await OtpModel.findByIdAndDelete(otpRecord._id)
            return res.json({ success: false, message: 'Failed to send OTP. Please try again.' })
        }

        // Generate temporary token
        const otpToken = jwt.sign(
            { identifier: normalizedIdentifier, type: 'signup' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '10m' }
        )

        console.log("=== SEND OTP SUCCESS ===");
        res.json({ success: true, otpToken })

    } catch (err) {
        console.error("=== SEND OTP ERROR ===");
        console.error(err);
        res.json({ success: false, message: 'Failed to send OTP: ' + err.message })
    }
}

//Function to verify the otp and sign up the user
const verifyOtpAndSignUp = async (req, res) => {
    const { name, identifier, password, otp, otpToken } = req.body
    
    console.log("=== OTP VERIFICATION DEBUG ===");
    
    try {
        // Verify JWT token
        console.log("1. Verifying JWT token...");
        const payload = jwt.verify(otpToken, process.env.JWT_SECRET)
        
        const tokenIdentifier = payload.identifier.toLowerCase().trim();
        const receivedIdentifier = identifier.toLowerCase().trim();
        
        if (tokenIdentifier !== receivedIdentifier) {
            console.log("❌ Identifier mismatch!");
            return res.json({ success: false, message: 'Invalid verification session' })
        }

        console.log("✅ JWT token valid");

        // Find valid OTP record
        console.log("2. Looking for valid OTP...");
        const otpRecord = await OtpModel.findValidOtp(tokenIdentifier, 'signup')

        if (!otpRecord) {
            console.log("❌ No valid OTP found");
            return res.json({ success: false, message: 'Invalid or expired OTP' })
        }

        console.log("✅ OTP record found");

        // Verify OTP
        console.log("3. Verifying OTP...");
        const isValidOtp = await otpRecord.verifyOtp(otp.trim())

        if (!isValidOtp) {
            console.log("❌ Invalid OTP");
            // Increment attempts
            await otpRecord.incrementAttempts()
            
            if (otpRecord.attempts >= 2) { // Will be 3 after increment
                return res.json({ success: false, message: 'Too many failed attempts. Please request a new OTP.' })
            }
            
            return res.json({ success: false, message: `Invalid OTP. ${3 - otpRecord.attempts - 1} attempts remaining.` })
        }

        console.log("✅ OTP verified successfully");

        // Check if user already exists (double-check)
        const userExists = await userModel.findOne({ 
            $or: [
                { email: tokenIdentifier }, 
                { phone: identifier.trim() }
            ] 
        })
        
        if (userExists) {
            await otpRecord.markAsUsed() // Mark OTP as used even if user exists
            return res.json({ success: false, message: 'User already exists, please login instead' })
        }

        // Hash password
        console.log("4. Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        console.log("5. Creating user...");
        const userData = {
            name: name.trim(),
            password: hashedPassword,
        }

        // Determine if email or phone
        if (tokenIdentifier.includes('@')) {
            userData.email = tokenIdentifier
        } else {
            userData.phone = identifier.trim() // Keep original format for phone
        }

        const user = await userModel.create(userData)
        console.log("✅ User created with ID:", user._id);

        // Mark OTP as used (important for security)
        await otpRecord.markAsUsed()
        console.log("✅ OTP marked as used");

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        )

        console.log("=== SUCCESS ===");
        res.json({ success: true, token })

    } catch (err) {
        console.error("=== ERROR ===");
        console.error("Error details:", err);
        
        if (err.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: 'Invalid verification session' })
        } else if (err.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Verification session expired' })
        }
        
        res.json({ success: false, message: 'Error verifying OTP: ' + err.message })
    }
}

// Function to login the user
const loginUser = async (req, res) => {
    try {
      const { identifier, password } = req.body;
      console.log("Login attempt with identifier:", identifier);
  
      // Input validation
      if (!identifier || !password) {
        return res.json({ success: false, message: 'Email/phone and password are required' });
      }
  
      // Normalize identifier (lowercase for emails, but not for phones)
      const isEmail = identifier.includes('@');
      const normalizedIdentifier = isEmail ? identifier.trim().toLowerCase() : identifier.trim();
  
      console.log("Normalized identifier:", normalizedIdentifier);
      console.log("Is email:", isEmail);
  
      // Find user - search both email and phone fields
      const user = await userModel.findOne({
        $or: [
          { email: normalizedIdentifier },
          { phone: identifier.trim() }
        ]
      });
  
      console.log("User found:", user ? "Yes" : "No");
      console.log("User details:", user ? { id: user._id, email: user.email, phone: user.phone } : "None");
  
      if (!user) {
        return res.json({ success: false, message: 'User Not Found, Please Sign Up' });
      }
  
      // Verify password
      console.log("Comparing password...");
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isValidPassword);
  
      if (!isValidPassword) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      console.log("Generating JWT token...");
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          phone: user.phone 
        }, 
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // 7 days expiry
      );
  
      console.log("Login successful for user:", user._id);
  
      // Optional: Update last login (only if you have these fields in your user model)
      try {
        await userModel.findByIdAndUpdate(user._id, { 
          lastLogin: new Date()
        });
      } catch (updateError) {
        console.log("Could not update last login (field might not exist):", updateError.message);
        // Don't fail login if this update fails
      }
  
      res.json({ success: true, token, message: 'Login successful' });
  
    } catch (error) {
      console.error('Login error details:', error);
      res.json({ success: false, message: 'Login failed. Please try again.' });
    }
  };

// Password reset functionality
const requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return sendErrorResponse(res, 'Email or phone number is required');
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const inputType = identifyInputType(normalizedIdentifier);

    if (!inputType) {
      return sendErrorResponse(res, 'Please enter a valid email or phone number');
    }

    // Find user
    const query = inputType === 'email' 
      ? { email: normalizedIdentifier } 
      : { phone: identifier.trim() };
    
    const user = await userModel.findOne(query);
    if (!user) {
      // Don't reveal if user exists or not
      return sendSuccessResponse(res, {}, 'If an account exists, a reset code has been sent');
    }

    // Generate reset token
    const resetToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    // Save reset token
    await OtpModel.create({
      identifier: inputType === 'email' ? user.email : user.phone,
      otp: resetToken,
      type: 'password_reset',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      userId: user._id
    });

    // Send reset code
    if (inputType === 'phone') {
      await sendSMS(user.phone, `Your password reset code is: ${resetToken}`);
    } else {
      await sendEmail(user.email, 'Password Reset Code', `Your password reset code is: ${resetToken}`);
    }

    sendSuccessResponse(res, {}, 'If an account exists, a reset code has been sent');

  } catch (error) {
    console.error('Password reset request error:', error);
    sendErrorResponse(res, 'Failed to process request. Please try again.', 500);
  }
};


// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        console.log("=== UPDATE PROFILE DEBUG ===")
        console.log("req.body:", req.body)
        console.log("userId from body:", userId)
        console.log("name:", name)
        console.log("phone:", phone)
        console.log("address:", address)
        
        const imageFile = req.file

        if (!userId) {
            return res.json({ success: false, message: "User ID missing - authentication issue" })
        }

        if (!name) {
            return res.json({ success: false, message: "Name is required" })
        }

        const updateData = { 
            name, 
            phone: phone || '', 
            address: address ? JSON.parse(address) : {}
        }
        
        if (dob) updateData.dob = dob
        if (gender) updateData.gender = gender

        await userModel.findByIdAndUpdate(userId, updateData)

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
            res.json({ success: true, message: "Payment Successful" })
        }
        else {
            res.json({ success: false, message: 'Payment Failed' })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe,
    sendOtp,
    verifyOtpAndSignUp
}