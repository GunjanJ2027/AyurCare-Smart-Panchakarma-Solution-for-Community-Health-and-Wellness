// src/services/api.js
import axios from 'axios';

// const API_URL = 'https://ayurcare-smart-panchakarma-solution-for.onrender.com/api';

const API_URL = 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to automatically attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;