import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    console.log("=== AUTH DEBUG ===")
    console.log("req.headers:", req.headers)
    
    const { token } = req.headers
    if (!token) {
        console.log("No token found in headers")
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("Token decoded successfully:", token_decode)
        req.userId = token_decode.id  // Store in req object instead of req.body
        req.body.userId = token_decode.id // Keep this for non-multipart requests
        console.log("Set userId to req.userId:", req.userId)
        next()
    } catch (error) {
        console.log("Token verification error:", error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser;