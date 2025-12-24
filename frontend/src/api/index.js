import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Though our backend currently doesn't strictly check Bearer for all routes, good practice.
    }
    return config;
});

export default api;
