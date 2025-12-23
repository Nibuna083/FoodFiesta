import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAgent, setIsAgent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isAgent ? '/auth/agent/login' : '/auth/login';
            const { data } = await api.post(endpoint, { email, password });

            localStorage.setItem('token', data.token);
            const user = data.user || data.agent;
            localStorage.setItem('user', JSON.stringify(user));

            if (isAgent) {
                navigate('/delivery-dashboard');
            } else if (user.role === 'admin') {
                navigate('/restaurant-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="auth-container card">
            <h2>Login to Food Fiesta</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        <input type="checkbox" checked={isAgent} onChange={(e) => setIsAgent(e.target.checked)} />
                        Login as Delivery Agent
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default Login;
