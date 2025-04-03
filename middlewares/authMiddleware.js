const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'invalid access token' });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
