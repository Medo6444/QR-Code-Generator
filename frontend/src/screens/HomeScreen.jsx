import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function HomeScreen({ navigation }) {
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchQRCode();

        // Fetch new QR code every 60 seconds
        const interval = setInterval(() => {
            fetchQRCode();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const fetchQRCode = async () => {
        try {
            const response = await api.get('/qr/current');
            setQrData(response.data.uuid);
            setLoading(false);
        } catch (error) {
            if (error.response?.status === 403 || error.response?.status === 401) {
                Alert.alert('Session Expired', 'Please login again');
                handleLogout();
            } else {
                Alert.alert('Error', 'Failed to fetch QR code');
            }
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigation.replace('Login');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {user?.name || user?.email}!</Text>
            </View>

            <View style={styles.qrContainer}>
                <Text style={styles.title}>Your QR Code</Text>
                <Text style={styles.subtitle}>Updates every 60 seconds</Text>

                {qrData ? (
                    <View style={styles.qrWrapper}>
                        <QRCode value={qrData} size={250} />
                    </View>
                ) : (
                    <Text style={styles.error}>No QR code available</Text>
                )}

                <Text style={styles.uuid}>{qrData}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        marginTop: 20,
        marginBottom: 20,
    },
    welcome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    qrContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 30,
    },
    qrWrapper: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    uuid: {
        marginTop: 20,
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});