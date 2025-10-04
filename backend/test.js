// Simple test script to verify all API endpoints
// Run with: node test-api.js

const http = require('http');

const BASE_URL = 'http://localhost:3000';
let authToken = '';

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, token = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve({ status: res.statusCode, data: response });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Test functions
async function testHealthCheck() {
    console.log('\n🔍 Testing Health Check...');
    const response = await makeRequest('GET', '/health');

    if (response.status === 200) {
        console.log('✅ Health check passed');
        console.log('   Response:', response.data);
    } else {
        console.log('❌ Health check failed');
        console.log('   Status:', response.status);
    }
}

async function testRegister() {
    console.log('\n🔍 Testing User Registration...');
    const testUser = {
        email: `test${Date.now()}@example.com`,
        password: 'test123456',
        name: 'Test User'
    };

    const response = await makeRequest('POST', '/auth/register', testUser);

    if (response.status === 201) {
        console.log('✅ Registration successful');
        console.log('   User:', response.data.user);
        authToken = response.data.token;
        console.log('   Token received:', authToken.substring(0, 20) + '...');
    } else {
        console.log('❌ Registration failed');
        console.log('   Status:', response.status);
        console.log('   Error:', response.data);
    }
}

async function testLogin() {
    console.log('\n🔍 Testing User Login...');

    // First register a user
    const testUser = {
        email: `login${Date.now()}@example.com`,
        password: 'test123456',
        name: 'Login Test'
    };

    await makeRequest('POST', '/auth/register', testUser);

    // Now try to login
    const loginData = {
        email: testUser.email,
        password: testUser.password
    };

    const response = await makeRequest('POST', '/auth/login', loginData);

    if (response.status === 200) {
        console.log('✅ Login successful');
        console.log('   User:', response.data.user);
        authToken = response.data.token;
    } else {
        console.log('❌ Login failed');
        console.log('   Status:', response.status);
        console.log('   Error:', response.data);
    }
}

async function testInvalidLogin() {
    console.log('\n🔍 Testing Invalid Login...');
    const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
    };

    const response = await makeRequest('POST', '/auth/login', loginData);

    if (response.status === 401) {
        console.log('✅ Invalid login properly rejected');
        console.log('   Error:', response.data.error);
    } else {
        console.log('❌ Invalid login test failed');
        console.log('   Status:', response.status);
    }
}

async function testGetCurrentUser() {
    console.log('\n🔍 Testing Get Current User (Protected Route)...');

    if (!authToken) {
        console.log('⚠️  Skipping - no auth token available');
        return;
    }

    const response = await makeRequest('GET', '/auth/me', null, authToken);

    if (response.status === 200) {
        console.log('✅ Get current user successful');
        console.log('   User:', response.data.user);
    } else {
        console.log('❌ Get current user failed');
        console.log('   Status:', response.status);
        console.log('   Error:', response.data);
    }
}

async function testGetCurrentUserWithoutToken() {
    console.log('\n🔍 Testing Get Current User Without Token...');

    const response = await makeRequest('GET', '/auth/me');

    if (response.status === 401) {
        console.log('✅ Unauthorized access properly rejected');
        console.log('   Error:', response.data.error);
    } else {
        console.log('❌ Unauthorized access test failed');
        console.log('   Status:', response.status);
    }
}

async function testGetQRCode() {
    console.log('\n🔍 Testing Get QR Code (Protected Route)...');

    if (!authToken) {
        console.log('⚠️  Skipping - no auth token available');
        return;
    }

    const response = await makeRequest('GET', '/qr/current', null, authToken);

    if (response.status === 200) {
        console.log('✅ Get QR code successful');
        console.log('   UUID:', response.data.uuid);
        console.log('   Timestamp:', response.data.timestamp);

        // Wait 2 seconds and fetch again to show UUID doesn't change immediately
        console.log('\n   Waiting 2 seconds and fetching again...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response2 = await makeRequest('GET', '/qr/current', null, authToken);
        console.log('   UUID (2s later):', response2.data.uuid);

        if (response.data.uuid === response2.data.uuid) {
            console.log('   ✓ UUID remains the same (changes every 60 seconds)');
        }
    } else {
        console.log('❌ Get QR code failed');
        console.log('   Status:', response.status);
        console.log('   Error:', response.data);
    }
}

async function testForgotPassword() {
    console.log('\n🔍 Testing Forgot Password...');
    const data = {
        email: 'test@example.com'
    };

    const response = await makeRequest('POST', '/auth/forgot-password', data);

    if (response.status === 200) {
        console.log('✅ Forgot password request successful');
        console.log('   Message:', response.data.message);
    } else {
        console.log('❌ Forgot password failed');
        console.log('   Status:', response.status);
        console.log('   Error:', response.data);
    }
}

async function testInvalidRoute() {
    console.log('\n🔍 Testing Invalid Route...');
    const response = await makeRequest('GET', '/invalid/route');

    if (response.status === 404) {
        console.log('✅ 404 error properly returned');
        console.log('   Error:', response.data.error);
    } else {
        console.log('❌ Invalid route test failed');
        console.log('   Status:', response.status);
    }
}

// Run all tests
async function runAllTests() {
    console.log('═══════════════════════════════════════════════');
    console.log('🚀 Starting API Tests');
    console.log('═══════════════════════════════════════════════');
    console.log('Base URL:', BASE_URL);
    console.log('Make sure the server is running on port 3000!');
    console.log('═══════════════════════════════════════════════');

    try {
        await testHealthCheck();
        await testRegister();
        await testLogin();
        await testInvalidLogin();
        await testGetCurrentUser();
        await testGetCurrentUserWithoutToken();
        await testGetQRCode();
        await testForgotPassword();
        await testInvalidRoute();

        console.log('\n═══════════════════════════════════════════════');
        console.log('✨ All tests completed!');
        console.log('═══════════════════════════════════════════════');
    } catch (error) {
        console.error('\n💥 Test error:', error.message);
        console.log('\nMake sure the server is running: npm start');
    }
}

// Run tests
runAllTests();