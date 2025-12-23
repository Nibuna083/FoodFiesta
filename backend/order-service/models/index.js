const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    cuisine: { type: String },
    image: { type: String } // URL to image
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const menuItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    available: { type: Boolean, default: true }
});

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Storing userId as String reference from Identity Service
    userName: { type: String }, // User's name for delivery
    userAddress: { type: String }, // Delivery address
    userPhone: { type: String }, // Contact number
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['placed', 'accepted', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'placed' },
    deliveryAgentId: { type: String }, // Reference from Identity Service
    createdAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const Category = mongoose.model('Category', categorySchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = { Restaurant, Category, MenuItem, Order };
