require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'Gateway is running' });
});

// Proxy routes
// Identity Service
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: {
        '^': '/api/auth' // Re-add the prefix stripped by express
    }
}));

// Order Service
app.use('/api/restaurants', createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: {
        '^': '/api/restaurants' // Re-add the prefix
    }
}));

app.use('/api/orders', createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    pathRewrite: {
        '^': '/api/orders' // Re-add the prefix
    }
}));

app.listen(PORT, () => {
    console.log(`Gateway Service running on port ${PORT}`);
});
