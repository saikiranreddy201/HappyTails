import nodemailer from 'nodemailer'

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendEmail = async (to, subject, otp) => {
  try {

    const mailOptions = {
      from: `"HappyTails 🐾" <${process.env.EMAIL_USER}>`, // Friendly sender name
      to,
      subject,
      text: `Hello,\n\nYour OTP for HappyTails is: ${otp}\nThis OTP is valid for 5 minutes.\n\nIf you didn't request this, please ignore this email.\n\nHappyTails Team`, // Plain text fallback
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 30px; border-radius: 10px; background-color: #f9f9f9;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50; font-size: 28px; margin: 0;">🐾 HappyTails</h1>
            <p style="color: #555; font-size: 16px; margin: 5px 0 0;">Your Trusted Pet Companion</p>
          </div>

          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">Use the following OTP to complete your action on HappyTails:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #4CAF50; background-color: #e0f7e0; padding: 15px 25px; border-radius: 8px; display: inline-block;">
              ${otp}
            </span>
          </div>

          <p style="font-size: 14px; color: #777; text-align: center;">
            This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
          </p>

          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
            If you did not request this email, you can safely ignore it.<br>
            🐾 HappyTails Team
          </p>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
  } catch (err) {
    console.error('Error sending email:', err)
    throw new Error('Failed to send email')
  }
}

export default sendEmail
