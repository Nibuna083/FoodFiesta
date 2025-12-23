import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">Food Fiesta 🍔</div>
                <div>
                    <span style={{ marginRight: '15px', fontWeight: 'bold' }}>{role?.toUpperCase()}</span>
                    <button onClick={handleLogout} style={{ backgroundColor: '#ff4757' }}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
