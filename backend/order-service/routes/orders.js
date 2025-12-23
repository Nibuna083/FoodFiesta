const express = require('express');
const { Order } = require('../models');

const router = express.Router();

// Place Order
router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error("Order Creation Failed:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get User Orders
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('restaurantId').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Pending Orders (For Delivery Agents / Restaurants)
// Simplified: Get all orders for now, or filter by status
router.get('/pending', async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'delivered' } }).populate('restaurantId').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order Status (Accept, Assign Agent, Deliver)
router.put('/:id/status', async (req, res) => {
    try {
        const { status, deliveryAgentId } = req.body;
        const updateData = { status };
        if (deliveryAgentId) updateData.deliveryAgentId = deliveryAgentId;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
