const express = require('express');
const router = express.Router();
const {
    getStats,
    getUsers,
    updateUserRole,
    deleteUser,
    getCourses,
    updateCourse,
    deleteCourse,
    approveCourse,
} = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Every admin route strictly requires a valid token AND the 'admin' role.
router.use(verifyToken, requireRole('admin'));

// Overview
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Courses
router.get('/courses', getCourses);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.put('/approve-course', approveCourse); // kept for backward compatibility

module.exports = router;
