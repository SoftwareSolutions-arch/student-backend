const jwt = require('jsonwebtoken');
const loginService  = require('../services/loginService');
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;
      
      if (!email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Call service function to authenticate user
      const { success, message, id, token } = await loginService.authenticateUser(email, password);

      if (!success) {
          return res.status(400).json({ message });
      }

      res.status(200).json({ 
        status: 'success',
        message:message,
        id: id,
        token : token
        });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
  
};

exports.logoutUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const success = await loginService.logoutUser(token);

        if (!success) {
            return res.status(400).json({ message: "Logout failed" });
        }

        res.status(200).json({ 
            status:"success",
            message: "Logged out successfully" 
        });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Forgot Password API
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await loginService.forgotPassword(email);
        res.status(response.status).json({ 
            status: 'success',
            message: response.message });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};
// verify otp
exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const result = await loginService.verifyOTP(email, otp);

        if (result.status !== 200) {
            return res.status(result.status).json({
                status: 'error',
                message: 'Invalid OTP or expired OTP'
            });
        }

        // Generate a short-lived token (valid for 10 minutes)
        const otpToken = jwt.sign({ email }, secretKey, { expiresIn: '10m' });

        return res.status(200).json({
            status: 'success',
            message: 'OTP verified successfully',
            otpToken: otpToken // Send OTP token for client-side storage
        });

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ 
            status: 'error', 
            message: "Server error", 
            error: error.message 
        });
    }
};


// Change Password API

exports.changePassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    try {
        const result = await loginService.changePassword(email, newPassword, confirmPassword);
        return res.status(result.status).json({
            status: 'success',
            result:result
        });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


