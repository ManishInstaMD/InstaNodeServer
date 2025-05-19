const express = require('express');
const authController = require('../controller/authController'); 
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

// Routes
router.post('/register', authController.register); 
router.post('/verifyOtp',authController.verifyOtp); 
router.post('/resend-otp',authController.resendOtp);  
router.post('/login',authController.login);
router.post('/forgotPassword',authController.forgotPassword)
router.post('/resetPasswordOtp',authController.resetPasswordOtp)
router.get('/profile',verifyToken,authController.getUserProfile)
router.post('/changePassword',verifyToken,authController.changePassword)
router.post('/updateProfile',verifyToken,authController.updateProfile)
router.post('/createPassword',authController.password)


module.exports = router;
