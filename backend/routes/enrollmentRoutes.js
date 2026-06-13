// routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const { enrollInCourse, getMyCourses } = require('../controllers/enrollmentController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Protected: Only students can enroll
router.post('/enroll', verifyToken, requireRole('student'), enrollInCourse);

// Protected: Students view their own dashboard
router.get('/my-courses', verifyToken, requireRole('student'), getMyCourses);

module.exports = router;