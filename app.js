require('dotenv').config();
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const pool = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Check if the database is connected
pool.query('SELECT NOW()', (err, res) => {
	if (err) {
	  console.error('Database connection error:', err.stack);
	} else {
	  console.log('Database connected successfully at:', res.rows[0].now);
	}
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const token = req.cookies.accessToken;
	try {const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        res.render('index', {user: decoded});
    } catch (err) {
        console.log(1);
        res.render('index', {user: null});
    }
});

app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
