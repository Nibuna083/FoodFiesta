const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    address: { type: String }
});

const deliveryAgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
    currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
});

const User = mongoose.model('User', userSchema);
const DeliveryAgent = mongoose.model('DeliveryAgent', deliveryAgentSchema);

module.exports = { User, DeliveryAgent };
