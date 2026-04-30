const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport Google Strategy setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In a real app, you would find or create a user in auth_db
    const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : ''
    };
    return cb(null, user);
  }
));

// Routes
// 1. Initiate Google OAuth
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// 2. Google OAuth Callback
app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login-failed', session: false }),
  function(req, res) {
    // Successful authentication, generate JWT
    const token = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    // Return token via JSON
    res.json({
        message: 'Login successful via Google',
        token: token,
        user: req.user
    });
  }
);

app.post('/test-login', (req, res) => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const token = jwt.sign(mockUser, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Mock Login successful', token, user: mockUser });
});

app.listen(PORT, () => {
    console.log(`Auth Service running on http://localhost:${PORT}`);
});
