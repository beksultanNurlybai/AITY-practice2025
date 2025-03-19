const express = require('express');
const router = express.Router();

const { registerUser, sendVerification, verifyByEmail, verifyBySMS } = require('../controllers/authController');

router.post('/register-user', registerUser);
router.post('/send-verification', sendVerification);
router.post('/verify-by-sms', verifyBySMS);
router.get('/verify-by-email', verifyByEmail);

module.exports = router;
