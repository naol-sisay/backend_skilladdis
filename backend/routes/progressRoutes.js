const express = require('express');
const router = express.Router();
const { markContentComplete } = require('../controllers/progressController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/complete', verifyToken, requireRole('student'), markContentComplete);

module.exports = router;