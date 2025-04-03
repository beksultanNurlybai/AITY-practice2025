const express = require('express');
const router = express.Router();

const { registerUser, sendVerification, verifyByEmail, verifyBySMS, refreshToken, logout } = require('../controllers/authController');

router.post('/register-user', registerUser);
router.post('/send-verification', sendVerification);
router.post('/verify-by-sms', verifyBySMS);
router.post('/verify-by-sms', verifyBySMS);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/verify-by-email', verifyByEmail);

module.exports = router;
