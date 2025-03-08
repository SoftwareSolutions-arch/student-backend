const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

router.post('/login', loginController.loginUser);
router.post('/logout', loginController.logoutUser);
router.post("/forgot-password", loginController.forgotPassword);
router.post("/verify-otp", loginController.verifyOTP);
router.post("/change-password", loginController.changePassword);

module.exports = router;