const express = require('express');
const { Restaurant, MenuItem, Category } = require('../models');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Restaurant
router.post('/', async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Menu for Restaurant
router.get('/:id/menu', async (req, res) => {
    try {
        const menu = await MenuItem.find({ restaurantId: req.params.id });
        res.json(menu);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Menu Item
router.post('/:id/menu', async (req, res) => {
    try {
        const menuItem = new MenuItem({ ...req.body, restaurantId: req.params.id });
        await menuItem.save();
        res.status(201).json(menuItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Category
router.post('/categories', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
