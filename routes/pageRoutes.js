const express = require('express');
const router = express.Router();

const { registrationPage, verificationMethodSelectionPage, verificationByEmailPage, verificationBySMSPage } = require('../controllers/pageController');

router.get('/registration', registrationPage);
router.get('/verification-method-selection', verificationMethodSelectionPage);
router.get('/verification-by-email', verificationByEmailPage);
router.get('/verification-by-sms', verificationBySMSPage);

module.exports = router;