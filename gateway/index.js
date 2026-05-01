const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Basic Rate Limiting: 60 requests per minute per IP
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60,
    message: { error: 'Too many requests from this IP, please try again after a minute.' }
});

// Apply rate limiter to all requests
app.use(limiter);

const jwt = require('jsonwebtoken');

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

// Target URLs for microservices
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:8000';
const ATTENDANCE_SERVICE_URL = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3002';

// Route configuration
// Auth Service: routes are at /google, /google/callback (no prefix needed)
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
}));

// Protected Routes
// Employee Service: Laravel routes at /api/employees, pathRewrite restores the path
app.use('/api/employees', authenticateToken, createProxyMiddleware({
    target: EMPLOYEE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => '/api/employees' + path,
}));

// Attendance Service: routes at / and /:id (no prefix needed)
app.use('/api/attendance', authenticateToken, createProxyMiddleware({
    target: ATTENDANCE_SERVICE_URL,
    changeOrigin: true,
}));

app.get('/', (req, res) => {
    res.json({ message: 'API Gateway is running' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
