require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes')

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

app.use(session({
	store: new pgSession({
		pool: pool,
		tableName: "session",
	}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }
}));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.render('index', {user: req.session.user});
});

app.use('/', pageRoutes);
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});