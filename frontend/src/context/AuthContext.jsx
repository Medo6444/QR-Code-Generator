import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../utils/storage';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await storage.getItem('token');
            if (token) {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            }
        } catch (error) {
            console.log('Auth check failed:', error);
            await storage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        await storage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (email, password, name) => {
        const response = await api.post('/auth/register', { email, password, name });
        await storage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        await storage.removeItem('token');
        setUser(null);
    };

    const forgotPassword = async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword }}>
            {children}
        </AuthContext.Provider>
    );
};