import axios from 'axios';
import { storage } from '../utils/storage';
import Constants from 'expo-constants';

// Replace with YOUR computer's IP
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        console.log('Making request to:', config.baseURL + config.url);
        const token = await storage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to see errors
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status);
        return response;
    },
    (error) => {
        console.error('Response error:', error.message);
        if (error.response) {
            console.error('Error data:', error.response.data);
            console.error('Error status:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export default api;