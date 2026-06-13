const express = require('express');
const router = express.Router();
const { approveCourse } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Notice we strictly require the 'admin' role here
router.put('/approve-course', verifyToken, requireRole('admin'), approveCourse);

module.exports = router;