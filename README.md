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
- Database support (PostgreSQL/MongoDB/SQLite)
- Input validation & error handling
