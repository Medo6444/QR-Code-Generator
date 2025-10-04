import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Login"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#007AFF',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
                    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'QR Code', headerLeft: null, gestureEnabled: false }} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}