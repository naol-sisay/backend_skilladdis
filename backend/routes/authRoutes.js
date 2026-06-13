// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/authController');
const { getMyProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware'); // Import middleware

// --- Multer setup for avatar uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || '.png';
        const safeId = String(req.user?.user_id || 'user').replace(/[^a-z0-9]/gi, '');
        cb(null, `avatar-${safeId}-${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
    fileFilter: (req, file, cb) => {
        if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) return cb(null, true);
        cb(new Error('Only image files (png, jpg, webp, gif) are allowed.'));
    },
});

// When a POST request hits /register, run the registerUser function
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Profile (authenticated) ---
router.get('/me', verifyToken, getMyProfile);
router.put('/profile', verifyToken, updateProfile);
router.post(
    '/profile/avatar',
    verifyToken,
    (req, res, next) => {
        upload.single('avatar')(req, res, (err) => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    uploadAvatar
);

// Legacy: lightweight profile echo (kept for backwards compatibility)
router.get('/profile', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to your secure profile data.',
        userData: req.user,
    });
});

// A route restricted only to instructors
router.get('/instructor-dashboard', verifyToken, requireRole('instructor'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the instructor dashboard.' });
});

module.exports = router;
