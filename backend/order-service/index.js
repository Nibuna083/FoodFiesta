require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Debug Logging
app.use((req, res, next) => {
    console.log(`[Order Service] Received: ${req.method} ${req.url}`);
    next();
});

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nibuna2102_db_user:Nibuna21%4026@delivery.b7aig5d.mongodb.net/?appName=Delivery';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Order Service: Connected to MongoDB'))
    .catch(err => console.error('Order Service: MongoDB connection error:', err));

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Order Service is running' });
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
