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

// Target URLs for microservices
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EMPLOYEE_SERVICE_URL = process.env.EMPLOYEE_SERVICE_URL || 'http://localhost:8000';
const ATTENDANCE_SERVICE_URL = process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3002';

// Route configuration
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
}));

app.use('/api/employees', createProxyMiddleware({
    target: EMPLOYEE_SERVICE_URL,
    changeOrigin: true,
}));

app.use('/api/attendance', createProxyMiddleware({
    target: ATTENDANCE_SERVICE_URL,
    changeOrigin: true,
}));

// We will add JWT validation middleware here in Day 5

app.get('/', (req, res) => {
    res.json({ message: 'API Gateway is running' });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
