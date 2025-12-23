import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.role === 'agent') {
                await api.post('/auth/agent/register', formData);
            } else {
                await api.post('/auth/register', formData);
            }
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="auth-container card">
            <h2>Join Food Fiesta</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Name</label>
                    <input name="name" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Email</label>
                    <input name="email" type="email" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input name="password" type="password" onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <label>Address</label>
                    <input name="address" onChange={handleChange} />
                </div>
                <div className="input-group">
                    <label>Role</label>
                    <select name="role" onChange={handleChange} value={formData.role}>
                        <option value="user">Customer</option>
                        <option value="admin">Restaurant Manager</option>
                        <option value="agent">Delivery Agent</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
