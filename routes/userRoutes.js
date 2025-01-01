const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/database');  // Import the database connection
const db = require('../config/database'); // Assuming database.js is in the root directory

// Route to render login page
router.get('/login', (req, res) => {
    res.render('user/login', { title: "Login", messages: req.flash() });
});

// Handle login form submission
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/user/login');
    }

    try {
        // Query the database to check if the email exists
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/user/login');
        }

        const user = rows[0];

        // Compare the password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/user/login');
        }

        // If login is successful, set session and redirect to home
        req.flash('success', 'Logged in successfully.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred.');
        res.redirect('/user/login');
    }
});

// Route to render the registration page
router.get('/register', (req, res) => {
    res.render('user/register', { title: "Register", messages: req.flash() });
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/user/register');
    }
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/user/register');
    }

    try {
        // Check if the email already exists in the database
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            req.flash('error', 'Email already exists.');
            return res.redirect('/user/register');
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

        req.flash('success', 'Registration successful. Please login.');
        res.redirect('/user/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred.');
        res.redirect('/user/register');
    }
});

module.exports = router;
