const registrationPage = (req, res) => {
    res.render('registration');
};

const verificationMethodSelectionPage = (req, res) => {
    const { email, phone_number } = req.query
    res.render('verificationMethodSelection', { email, phone_number });
};

const verificationByEmailPage = (req, res) => {
    res.render('verificationByEmail');
};

const verificationBySMSPage = (req, res) => {
    res.render('verificationBySMS');
};

module.exports = {
    registrationPage,
    verificationMethodSelectionPage, 
    verificationByEmailPage,
    verificationBySMSPage
};