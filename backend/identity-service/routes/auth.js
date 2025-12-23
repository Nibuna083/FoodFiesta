const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, DeliveryAgent } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// USER REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, address, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// USER LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AGENT REGISTER
router.post('/agent/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const agent = new DeliveryAgent({ name, email, password: hashedPassword });
        await agent.save();
        res.status(201).json({ message: 'Delivery Agent registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// AGENT LOGIN
router.post('/agent/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const agent = await DeliveryAgent.findOne({ email });
        if (!agent) return res.status(404).json({ error: 'Agent not found' });

        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: agent._id, role: 'agent' }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, agent: { id: agent._id, name: agent.name, email: agent.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
