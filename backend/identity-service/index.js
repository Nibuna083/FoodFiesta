require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nibuna2102_db_user:Nibuna21%4026@delivery.b7aig5d.mongodb.net/?appName=Delivery';

mongoose.connect(MONGO_URI)
    .then(() => console.log('Identity Service: Connected to MongoDB'))
    .catch(err => console.error('Identity Service: MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'Identity Service is running' });
});

app.listen(PORT, () => {
    console.log(`Identity Service running on port ${PORT}`);
});
