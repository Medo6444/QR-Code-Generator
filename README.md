# Expo QR Authentication App

A full-stack **React Native (Expo)** + **Node.js (Express)** project that demonstrates:
- User authentication (JWT-based)
- Secure token storage
- Time-based QR code generation that refreshes every 60 seconds
- Realistic full-stack structure (frontend + backend)

This project was created as a coding task to showcase **authentication**, **state management**, and **real-time updates** in a mobile application.

---

## 🚀 Features

### Frontend (React Native with Expo)
- User registration & login
- JWT token authentication with secure storage
- Forgot password screen
- Main screen displaying a QR code with a random UUID
- QR code refreshes automatically every 60 seconds
- Clean UI with proper loading and error states
- Responsive design

### Backend (Node.js + Express)
- User registration/login endpoints
- JWT authentication with expiration
- Password hashing with bcrypt
- Forgot password API route (stubbed or email integration optional)
- `/qr/current` endpoint providing rotating UUID every 60 seconds
- Input validation & error handling
- In-memory storage (can be replaced with PostgreSQL/MongoDB/SQLite)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn**
- **Expo Go** app on your mobile device:
  - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- (Optional) Android Studio or Xcode for emulator/simulator

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Backend Setup

#### Navigate to Backend Folder

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### Create Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Start the Backend Server

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

You should see:

```
Server is running on port 3000
Health check: http://localhost:3000/health
QR Code updated: <uuid>
```

The server will automatically generate a new QR code UUID every 60 seconds.

---

### 3. Frontend Setup

#### Navigate to Frontend Folder

Open a **new terminal** and run:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install --legacy-peer-deps
```

#### Configure Environment Variables

**Step 1:** Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

**Step 2:** Find your computer's local IP address:

**Windows (PowerShell):**

```bash
ipconfig
```

Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**

```bash
ifconfig | grep "inet "
# or
hostname -I
```

**Step 3:** Edit `.env` and update the API URL:

```env
EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:3000
```

Example: `EXPO_PUBLIC_API_URL=http://192.168.1.100:3000`

**Important Notes:**
- For **Android Emulator**, use: `http://10.0.2.2:3000`
- For **iOS Simulator**, use: `http://localhost:3000`
- For **Physical Device**, use your computer's local IP: `http://192.168.1.XXX:3000`

#### Start the Expo Development Server

```bash
npx expo start --clear
```

---

## 📱 Running the App

### Option 1: Physical Device (Recommended)

1. Make sure your phone and computer are on the **same WiFi network**
2. Open **Expo Go** app on your phone
3. Scan the QR code displayed in your terminal:
   - **iOS**: Use the Camera app to scan, then tap the notification
   - **Android**: Use the Expo Go app's built-in QR scanner

### Option 2: Android Emulator

```bash
# Press 'a' in the terminal where Expo is running
# Or run:
npx expo start --android
```

### Option 3: iOS Simulator (Mac only)

```bash
# Press 'i' in the terminal where Expo is running
# Or run:
npx expo start --ios
```

---

## 🧪 Testing the App

### Test Credentials

You can create a new account or use any email/password combination (data is stored in-memory).

### Test Flow:

1. **Register** a new account with any email and password (min 6 characters)
2. **Login** with your credentials
3. View the **QR code** on the home screen
4. Wait 60 seconds to see the QR code automatically refresh
5. Test **Logout** functionality
6. Test **Forgot Password** screen (returns success message, no email sent in this version)

---

## 📂 Project Structure

```
project-root/
├── backend/
│   ├── server.js           # Express server with all API endpoints
│   ├── package.json
│   └── .env                # Environment variables (not in git)
│
└── frontend/
    ├── App.jsx             # Main app component with navigation
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx      # Authentication state management
    │   ├── screens/
    │   │   ├── LoginScreen.jsx
    │   │   ├── RegisterScreen.jsx
    │   │   ├── ForgotPasswordScreen.jsx
    │   │   └── HomeScreen.jsx       # QR code display
    │   ├── services/
    │   │   └── api.js               # Axios instance with interceptors
    │   └── utils/
    │       └── storage.js           # Secure token storage wrapper
    ├── assets/                      # App icons and images
    ├── package.json
    ├── app.json                     # Expo configuration
    └── .env                         # Environment variables (not in git)
```

---

## 🔧 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `GET /auth/me` - Get current user (protected)

### QR Code

- `GET /qr/current` - Get current QR UUID (protected)

### Health Check

- `GET /health` - Server health status

---

## 🐛 Troubleshooting

### "Network Error" or "Request Failed"

- Ensure backend server is running
- Check that your `.env` has the correct IP address
- Verify your phone and computer are on the same WiFi
- Check Windows Firewall allows Node.js connections

### "Unable to resolve module"

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npx expo start --clear
```

### QR Code Not Updating

- Check backend terminal - should log "QR Code updated" every 60 seconds
- Verify frontend is polling the `/qr/current` endpoint
- Check network connection between app and backend

### "Invariant Violation: TurboModuleRegistry"

```bash
# Clear Expo cache
npx expo start --clear
# Close and reopen Expo Go app on your device
```

---

## 🔐 Security Notes

⚠️ **This is a development/demo project. For production use:**

- Replace in-memory storage with a real database
- Use environment variables for all secrets
- Implement actual email sending for password reset
- Add rate limiting to prevent abuse
- Use HTTPS in production
- Implement refresh tokens
- Add input sanitization
- Set up proper CORS policies

---

## 📦 Dependencies

### Backend

- express - Web framework
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- uuid - UUID generation
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend

- expo - React Native framework
- react-navigation - Navigation library
- axios - HTTP client
- expo-secure-store - Secure token storage
- react-native-qrcode-svg - QR code generation
- react-native-svg - SVG support

---

## 📝 License

This project is created for educational/demonstration purposes.

---

## 👤 Author

Ahmed Khaled Mohammad

---
