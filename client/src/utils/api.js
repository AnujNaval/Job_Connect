import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // Change this as per your backend
  withCredentials: true,
});

// Request interceptor to add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      // Redirect to login - adjust this based on your routing setup
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;