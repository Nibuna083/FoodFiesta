import React, { useState, useEffect } from 'react';
import api from '../api';
import Navbar from '../components/Navbar';

const UserDashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState({}); // { itemId: { ...item, qty } }
    const [orders, setOrders] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState({ address: '', phone: '' });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchRestaurants();
        fetchOrders();
    }, []);

    const fetchRestaurants = async () => {
        const { data } = await api.get('/restaurants');
        setRestaurants(data);
    };

    const fetchOrders = async () => {
        const { data } = await api.get(`/orders/user/${user.id}`);
        setOrders(data);
    };

    const handleRestaurantClick = async (rest) => {
        setSelectedRestaurant(rest);
        setCart({}); // Clear cart when switching restaurant
        const { data } = await api.get(`/restaurants/${rest._id}/menu`);
        setMenu(data);
    };

    const addToCart = (item) => {
        setCart(prev => ({
            ...prev,
            [item._id]: {
                ...item,
                qty: (prev[item._id]?.qty || 0) + 1
            }
        }));
    };

    const placeOrder = async () => {
        const cartItems = Object.values(cart);
        console.log('Cart Items:', cartItems);

        const items = cartItems.map(i => ({
            menuItemId: i._id,
            name: i.name,
            quantity: i.qty,
            price: parseFloat(i.price)
        }));

        const totalAmount = cartItems.reduce((sum, i) => sum + (parseFloat(i.price) * i.qty), 0);
        console.log('Calculated Total:', totalAmount);

        try {
            await api.post('/orders', {
                userId: user.id,
                userName: user.name,
                userAddress: deliveryDetails.address,
                userPhone: deliveryDetails.phone,
                restaurantId: selectedRestaurant._id,
                items,
                totalAmount
            });
            alert('Order placed successfully!');
            setCart({});
            setSelectedRestaurant(null);
            setShowCheckout(false);
            setDeliveryDetails({ address: '', phone: '' });
            fetchOrders();
        } catch (err) {
            console.error('Failed to place order:', err.response ? err.response.data : err.message);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <div>
            <Navbar role="user" />
            <div className="container">
                <h1>Welcome, {user.name}</h1>

                {selectedRestaurant ? (
                    <div>
                        <button onClick={() => setSelectedRestaurant(null)}>← Back to Restaurants</button>
                        <h2>{selectedRestaurant.name} Menu</h2>
                        <div className="grid">
                            {menu.map(item => (
                                <div key={item._id} className="card">
                                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <h3>{item.name}</h3>
                                    <p>{item.description}</p>
                                    <p>${item.price}</p>
                                    <button onClick={() => addToCart(item)}>Add to Cart</button>
                                </div>
                            ))}
                        </div>

                        {Object.keys(cart).length > 0 && (
                            <div className="card" style={{ position: 'fixed', bottom: 20, right: 20, width: '300px', border: '2px solid #ff6b6b' }}>
                                <h3>Cart</h3>
                                {Object.values(cart).map(i => (
                                    <div key={i._id}>{i.name} x {i.qty} - ${(i.price * i.qty).toFixed(2)}</div>
                                ))}
                                <hr />
                                <strong>Total: ${Object.values(cart).reduce((sum, i) => sum + (i.price * i.qty), 0).toFixed(2)}</strong>
                                <button onClick={() => setShowCheckout(true)} style={{ width: '100%', marginTop: '10px' }}>Checkout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <h2>Restaurants</h2>
                        <div className="grid">
                            {restaurants.map(rest => (
                                <div key={rest._id} className="card">
                                    <img src={rest.image || 'https://via.placeholder.com/150'} alt={rest.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <h3>{rest.name}</h3>
                                    <p>{rest.cuisine}</p>
                                    <button onClick={() => handleRestaurantClick(rest)}>View Menu</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <hr style={{ margin: '40px 0' }} />

                <h2>Your Orders</h2>
                {orders.map(order => (
                    <div key={order._id} className="card">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Restaurant:</strong> {order.restaurantId?.name}</p>
                        <p><strong>Status:</strong> <span style={{ color: 'blue', fontWeight: 'bold' }}>{order.status}</span></p>
                        <p><strong>Total:</strong> ${order.totalAmount}</p>
                    </div>
                ))}
            </div>

            {/* Checkout Modal */}
            {showCheckout && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
                        <h2>Delivery Details</h2>
                        <div className="input-group">
                            <label>Delivery Address *</label>
                            <textarea
                                value={deliveryDetails.address}
                                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                                placeholder="Enter complete delivery address"
                                rows="3"
                                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Contact Number *</label>
                            <input
                                type="tel"
                                value={deliveryDetails.phone}
                                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => {
                                    if (!deliveryDetails.address || !deliveryDetails.phone) {
                                        alert('Please fill in all delivery details');
                                        return;
                                    }
                                    placeOrder();
                                }}
                                style={{ flex: 1 }}
                            >
                                Place Order
                            </button>
                            <button
                                onClick={() => {
                                    setShowCheckout(false);
                                    setDeliveryDetails({ address: '', phone: '' });
                                }}
                                style={{ flex: 1, backgroundColor: '#95a5a6' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
