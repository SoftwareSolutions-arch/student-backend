const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/registerModel");
const crypto = require("crypto");
const transporter = require("../config/emailConfig");

exports.authenticateUser = async (email, password) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return { success: false, message: "User Doesn't exist" };
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid email or password" };
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        if (!user.token || user.token !== token) {
            user.token = token;
            await user.save();
        }
       
        return { success: true, message: "Login successful", id:user._id,token };
    } catch (error) {
        return { success: false, message: "Server error", error: error.message };
    }
};

exports.logoutUser = async (token) => {
    try {
        const user = await User.findOne({ token });

        if (!user) {
            return false;
        }

        user.token = null; // Clear token from DB
        await user.save();

        return true;
    } catch (error) {
        return false;
    }
};


exports.forgotPassword = async (email) => {
    try {
        console.log('email' ,email);
        
        // 🔹 Check if user exists
        const user = await User.findOne({ email });
        console.log('user' ,user);
        if (!user) {
            return { status: 404, message: "User not found" };
        }
        console.log('exist is iser' ,user);


        // 🔹 Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

        // 🔹 Save OTP in the database
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
        console.log('process.env.EMAIL_USER',process.env.EMAIL_USER);
        
        // 🔹 Send OTP via email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset OTP - Ez-Onsite",
            text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
        });

        return { status: 200, message: "OTP sent successfully" };
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { status: 500, message: "Error sending OTP" };
    }
};

exports.verifyOTP = async (email, otp) => {
    console.log('Email:', email);
    console.log('OTP:', otp);

    const user = await User.findOne({ email });
    console.log('User:', user);

    if (!user) {
        return { success: false, status: 404, message: "User not found" };
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return { success: false, status: 400, message: "Invalid or expired OTP" };
    }

    // Clear OTP fields after successful verification
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return { success: true, status: 200, message: "OTP verified successfully" };
};



exports.changePassword = async (email, newPassword, confirmPassword) => {
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, status: 404, message: "User not found" };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, status: 400, message: "Passwords do not match" };
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return { success: true, status: 200, message: "Password changed successfully" };
};
