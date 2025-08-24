import twilio from 'twilio'

// Initialize the Twilio client with your SID and AUTH TOKEN
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)

// Function to send SMS
export const sendSMS = async (to, message) => {
  try {
    console.log("Sending SMS to:", to, "with message:", message)
    const response = await client.messages.create({
      body: message,            // Message to send
      from: process.env.TWILIO_PHONE, // Your Twilio phone number
      to: to                     // Recipient's phone number
    })
    return response // You can log this response if needed
  } catch (error) {
    console.error("Error sending SMS:", error)
    throw new Error("Failed to send SMS") // You can customize error handling
  }
}

export default sendSMS; // Default export for the function