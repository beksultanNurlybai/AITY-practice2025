const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const validator = require("validator");
const twilioClient = require('../config/twilio');
const pool = require('../config/db');


const registerUser = async (req, res) => {
    const { first_name, last_name, patronymic, position, email, phone_number, employee_number } = req.body;

    if (!first_name || !last_name || !email || !phone_number) {
        return res.status(400).json({ error: 'One of the following fields are empty: first_name, last_name, email or phone_number.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    if (!validator.isMobilePhone(phone_number, "kk-KZ")) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    // check if the user is already registered. 
    try {
        for (let table of ['pending_users', 'users']) {
            for (let [attr, val] of Object.entries({ email, phone_number, employee_number })) {
                let user = await pool.query(`SELECT id FROM ${table} WHERE ${attr} = $1`, [val]);
        
                if (user.rows.length > 0) {
                    return res.status(400).json({ error: `${attr} is registered.` });
                }
            }
        }
    } catch (error) {
        console.error('Error during registration: verification failed:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

    try {
        await pool.query(
            `INSERT INTO pending_users (first_name, last_name, patronymic, position, email, phone_number, employee_number, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
            [first_name, last_name, patronymic, position, email, phone_number, employee_number]
        );

        res.status(200).json({ message: 'Registration successful. Please choose a verification method.', email, phone_number });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const sendVerification = async (req, res) => {
    const { method, email, phone_number } = req.body; // method: 'sms' or 'email'

    if (!method || !email || !phone_number) {
        return res.status(400).json({ error: 'Verification method are required.' });
    }

    try {
        user = await pool.query(`SELECT id FROM pending_users WHERE phone_number = $1`, [phone_number]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (method === 'sms') {
            // Generate and send SMS code
            const verificationCode = crypto.randomInt(100000, 999999).toString();
            await pool.query(`UPDATE pending_users SET verification_code = $1, expires_at = NOW() + INTERVAL '10 minutes' WHERE phone_number = $2`, [verificationCode, phone_number]);
            await twilioClient.messages.create({
                body: `Your verification code is: ${verificationCode}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone_number
            });
            res.status(200).json({ message: 'SMS code sent.' });
        } else if (method === 'email') {
            // Generate registration URL
            const registrationToken = uuidv4();
            const registrationLink = `http://localhost:3000/api/auth/verify-by-email?token=${registrationToken}`;

            await pool.query(`UPDATE pending_users SET registration_token = $1, expires_at = NOW() + INTERVAL '10 minutes' WHERE email = $2`, [registrationToken, email]);
            // Send email
            await sendVerificationEmail(email, registrationLink);
            res.status(200).json({ message: 'Verification email sent.' });
        } else {
            res.status(400).json({ error: 'Invalid verification method.' });
        }
    } catch (error) {
        console.error('Error during verification selection:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to send verification email
const sendVerificationEmail = async (email, registrationLink) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification',
        text: `Follow the link to verify registration: ${registrationLink}`
    };

    await transporter.sendMail(mailOptions);
};


async function finishVerification(user){
    // puts the user from pending_users to users table
    const result = await pool.query(
        `INSERT INTO users (first_name, last_name, patronymic, position, email, phone_number, employee_number, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, first_name, email`,
        [user.first_name, user.last_name, user.patronymic, user.position, user.email, user.phone_number, user.employee_number]
    );
}

const verifyByEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Token is required for verification' });
    }

    try {
        // Find user in pending_users using the token
        const result = await pool.query(
            `SELECT * FROM pending_users WHERE registration_token = $1 AND expires_at > NOW()`,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired verification token' });
        }

        finishVerification(result.rows[0]);

        // Delete user from pending_users after successful verification
        await pool.query(`DELETE FROM pending_users WHERE registration_token = $1`, [token]);

        res.redirect('/');
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const verifyBySMS = async (req, res) => {
    const { phone_number, verification_code } = req.body;

    if (!phone_number || !verification_code) {
        return res.status(400).json({ error: 'Phone number and verification code are required for verification' });
    }
    try {
        // Find user in pending_users using the phone_number and verification_code
        const result = await pool.query(
            `SELECT * FROM pending_users WHERE phone_number = $1 AND verification_code = $2 AND expires_at > NOW()`,
            [phone_number, verification_code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        finishVerification(result.rows[0]);
        
        // Delete user from pending_users after successful verification
        await pool.query(`DELETE FROM pending_users WHERE phone_number = $1`, [phone_number]);

        res.status(200).json({message: 'User is verified successfully.'});
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    registerUser,
    sendVerification,
    verifyByEmail,
    verifyBySMS,
};