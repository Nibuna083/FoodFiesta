import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const RestaurantDashboard = () => {
    const [restaurant, setRestaurant] = useState(null); // Assuming user manages one restaurant
    const [orders, setOrders] = useState([]);
    const [menuForm, setMenuForm] = useState({ name: '', price: '', category: '', description: '' });

    // For demo, we might need a way to link user to restaurant. 
    // I'll add a simple "Create Restaurant" if none found, or list all (as admin).
    // Let's assume this user is an Admin who can manage ALL restaurants or just one.
    // To keep it simple, I'll list all restaurants and let (Admin) pick one to manage.
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchRestaurants();
        fetchOrders(); // View all orders for simplicity
    }, []);

    const fetchRestaurants = async () => {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
    };

    const fetchOrders = async () => {
        const { data } = await api.get('/orders/pending');
        setOrders(data);
    };

    const createRestaurant = async (e) => {
        e.preventDefault();
        const name = prompt("Restaurant Name:");
        const cuisine = prompt("Cuisine:");
        const address = prompt("Address:");
        const image = prompt("Image URL (optional):");
        if (name) {
            await api.post('/restaurants', { name, cuisine, address, image });
            fetchRestaurants();
        }
    };

    const addMenuItem = async (e) => {
        e.preventDefault();
        if (!restaurant) return alert('Select a restaurant first');
        await api.post(`/restaurants/${restaurant._id}/menu`, menuForm);
        alert('Item added');
        setMenuForm({ name: '', price: '', category: '', description: '' });
    };

    const updateStatus = async (orderId, status) => {
        await api.put(`/orders/${orderId}/status`, { status });
        fetchOrders();
    };

    return (
        <div>
            <Navbar role="admin" />
            <div className="container">
                <h1>Restaurant Management</h1>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <h2>Restaurants</h2>
                        <button onClick={createRestaurant}>+ Add New Restaurant</button>
                        {restaurants.map(r => (
                            <div key={r._id} className="card" onClick={() => setRestaurant(r)} style={{ border: restaurant?._id === r._id ? '2px solid blue' : 'none', cursor: 'pointer' }}>
                                {r.name}
                            </div>
                        ))}

                        {restaurant && (
                            <div className="card">
                                <h3>Add Menu to {restaurant.name}</h3>
                                <form onSubmit={addMenuItem}>
                                    <div className="input-group"><input placeholder="Name" value={menuForm.name} onChange={e => setMenuForm({ ...menuForm, name: e.target.value })} /></div>
                                    <div className="input-group"><input placeholder="Price" value={menuForm.price} onChange={e => setMenuForm({ ...menuForm, price: e.target.value })} /></div>
                                    <div className="input-group"><input placeholder="Category" value={menuForm.category} onChange={e => setMenuForm({ ...menuForm, category: e.target.value })} /></div>
                                    <div className="input-group"><input placeholder="Image URL" value={menuForm.image || ''} onChange={e => setMenuForm({ ...menuForm, image: e.target.value })} /></div>
                                    <button>Add Item</button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <h2>Incoming Orders</h2>
                        {orders.map(order => (
                            <div key={order._id} className="card">
                                <h4>Order #{order._id.slice(-4)}</h4>
                                <p><strong>Restaurant:</strong> {order.restaurantId?.name}</p>
                                <p>Items: {order.items.map(i => i.name).join(', ')}</p>
                                <p>Status: {order.status}</p>
                                {order.status === 'placed' && <button onClick={() => updateStatus(order._id, 'accepted')}>Accept</button>}
                                {order.status === 'accepted' && <button onClick={() => updateStatus(order._id, 'preparing')}>Start Preparing</button>}
                                {order.status === 'preparing' && <button onClick={() => updateStatus(order._id, 'out-for-delivery')}>Ready for Delivery</button>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDashboard;
