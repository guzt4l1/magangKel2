// backend/server.js (atau app.js)
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');         // ✅ untuk daftar user
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
// const testRoute = require('./routes/testRoute');
const berandaRoutes = require('./routes/beranda');

const sequelize = require('./config/db');
require('dotenv').config();


const app = express();

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // sesuaikan dengan port frontend kamu
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);             // ✅ ubah prefix jadi /api/users
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
// app.use('/api/test', testRoute);
app.use('/api/beranda', berandaRoutes);

// Sync database
sequelize.sync().then(() => console.log('Database synced'));

module.exports = app;
