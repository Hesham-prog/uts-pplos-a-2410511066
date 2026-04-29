const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Placeholder route to generate a test JWT (until Google OAuth is implemented)
app.post('/test-login', (req, res) => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    
    const token = jwt.sign(mockUser, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    res.json({ message: 'Login successful', token, user: mockUser });
});

// We will add Passport and Google OAuth routes here in Day 6

app.listen(PORT, () => {
    console.log(`Auth Service running on http://localhost:${PORT}`);
});
