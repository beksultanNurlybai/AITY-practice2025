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

const dashboardPage = (req, res) => {
    res.render('dashboard', {user: req.user});
}

module.exports = {
    registrationPage,
    verificationMethodSelectionPage, 
    verificationByEmailPage,
    verificationBySMSPage,
    dashboardPage
};