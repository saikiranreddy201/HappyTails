import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const otpSchema = new mongoose.Schema({
  identifier: { 
    type: String, 
    required: true,
    lowercase: true, // Normalize emails to lowercase
    trim: true
  },
  otp: { 
    type: String, 
    required: true 
  }, // Will store hashed OTP
  type: {
    type: String,
    enum: ['signup', 'password_reset', 'login_verification'],
    default: 'signup'
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3 // Maximum 3 attempts
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: { 
    type: Date, 
    required: true,
    // MongoDB TTL index - automatically deletes expired documents
    index: { expireAfterSeconds: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Optional: Track user if you want to link to user model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
})

// Compound index for efficient queries
otpSchema.index({ identifier: 1, type: 1 })

// Index for cleanup of used OTPs (optional - MongoDB TTL will handle expired ones)
otpSchema.index({ isUsed: 1, createdAt: 1 })

// Hash OTP before saving
otpSchema.pre('save', async function(next) {
  // Only hash if OTP is new or modified
  if (!this.isModified('otp')) return next()
  
  try {
    // Hash the OTP with salt rounds
    const salt = await bcrypt.genSalt(10)
    this.otp = await bcrypt.hash(this.otp, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to verify OTP
otpSchema.methods.verifyOtp = async function(plainOtp) {
  return await bcrypt.compare(plainOtp, this.otp)
}

// Method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt
}

// Method to increment attempts
otpSchema.methods.incrementAttempts = async function() {
  this.attempts += 1
  return await this.save()
}

// Method to mark as used
otpSchema.methods.markAsUsed = async function() {
  this.isUsed = true
  return await this.save()
}

// Static method to cleanup used OTPs (optional - for immediate cleanup)
otpSchema.statics.cleanupUsedOtps = async function() {
  return await this.deleteMany({ 
    $or: [
      { isUsed: true },
      { expiresAt: { $lt: new Date() } }
    ]
  })
}

// Static method to find valid OTP
otpSchema.statics.findValidOtp = async function(identifier, type = 'signup') {
  return await this.findOne({
    identifier: identifier.toLowerCase().trim(),
    type,
    isUsed: false,
    expiresAt: { $gt: new Date() },
    attempts: { $lt: 3 }
  })
}

const OtpModel = mongoose.model('Otp', otpSchema)

export default OtpModel