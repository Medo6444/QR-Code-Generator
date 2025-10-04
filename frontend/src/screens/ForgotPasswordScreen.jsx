import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword } = useAuth();

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const response = await forgotPassword(email);
            Alert.alert('Success', response.message, [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email and we'll send you instructions to reset your password
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleForgotPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Send Reset Link</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.link}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 14,
    },
});