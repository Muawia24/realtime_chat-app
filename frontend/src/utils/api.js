import axios from 'axios';


const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const token = JSON.parse(userInfo).token;
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle expired tokens
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;
        if (response && response.status === 401 && response.data.message === 'Token expired') {
            window.location.href = '/logout';
        }
        return Promise.reject(error);
    }
);

export default API;