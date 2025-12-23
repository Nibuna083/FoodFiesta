import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const DeliveryDashboard = () => {
    const [orders, setOrders] = useState([]);
    const agent = JSON.parse(localStorage.getItem('user')); // stored as user in login logic

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const { data } = await api.get('/orders/pending');
        setOrders(data);
    };

    const acceptOrder = async (orderId) => {
        await api.put(`/orders/${orderId}/status`, {
            status: 'out-for-delivery', // Actually it's already out-for-delivery, but agent 'assigns' self?
            // Let's say Restaurant marks 'ready', then Agent marks 'picked up'.
            // My backend logic: updateStatus takes deliveryAgentId.
            deliveryAgentId: agent.id
        });
        fetchOrders();
    };

    const markDelivered = async (orderId) => {
        await api.put(`/orders/${orderId}/status`, { status: 'delivered' });
        fetchOrders();
    };

    return (
        <div>
            <Navbar role="delivery" />
            <div className="container">
                <h1>Delivery Dashboard</h1>
                <div className="grid">
                    {orders.map(order => {
                        const isAssignedToMe = order.deliveryAgentId === agent.id;
                        const canAccept = !order.deliveryAgentId && order.status === 'out-for-delivery';

                        // Hide delivered orders
                        if (order.status === 'delivered') return null;

                        return (
                            <div key={order._id} className="card">
                                <h3>Order #{order._id.slice(-4)}</h3>
                                <p><strong>Customer:</strong> {order.userName || 'N/A'}</p>
                                <p><strong>Phone:</strong> {order.userPhone || 'N/A'}</p>
                                <p><strong>Delivery Address:</strong> {order.userAddress || 'N/A'}</p>
                                <p><strong>Restaurant:</strong> {order.restaurantId?.name}</p>
                                <p><strong>Restaurant Address:</strong> {order.restaurantId?.address}</p>
                                <p><strong>Status:</strong> <span style={{ color: order.status === 'out-for-delivery' ? 'green' : 'orange', fontWeight: 'bold' }}>{order.status}</span></p>
                                <p><strong>Total:</strong> ${order.totalAmount}</p>
                                <p><strong>Items:</strong> {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>

                                {canAccept && <button onClick={() => acceptOrder(order._id)}>Accept Delivery</button>}
                                {isAssignedToMe && order.status !== 'delivered' && (
                                    <button onClick={() => markDelivered(order._id)} style={{ backgroundColor: 'green' }}>Mark Delivered</button>
                                )}
                                {!canAccept && !isAssignedToMe && (
                                    <p style={{ color: 'gray', fontStyle: 'italic' }}>Waiting for restaurant to prepare...</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
