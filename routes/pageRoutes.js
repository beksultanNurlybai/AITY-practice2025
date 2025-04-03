const express = require('express');
const router = express.Router();

const { registrationPage, verificationMethodSelectionPage, verificationByEmailPage, verificationBySMSPage, dashboardPage } = require('../controllers/pageController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/registration', registrationPage);
router.get('/verification-method-selection', verificationMethodSelectionPage);
router.get('/verification-by-email', verificationByEmailPage);
router.get('/verification-by-sms', verificationBySMSPage);
router.get('/dashboard', authenticateToken, dashboardPage);

module.exports = router;