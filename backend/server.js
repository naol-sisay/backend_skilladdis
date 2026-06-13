require('dotenv').config();
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files (profile photos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
// Import your routes

// Tell Express to use your routes. 
// Any request starting with /api/auth will go to authRoutes.js

// Your existing test route
app.use('/api/test', (req, res) => {
    res.json({ message: 'SkillAddis backend is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});