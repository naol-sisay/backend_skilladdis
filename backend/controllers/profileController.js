// controllers/profileController.js
const db = require('../config/db');

// Safely run a COUNT query, returning 0 if the table/column isn't present yet.
const safeCount = async (sql, params) => {
    try {
        const [rows] = await db.query(sql, params);
        return rows[0]?.count ?? 0;
    } catch (err) {
        console.warn('profile stat query skipped:', err.code || err.message);
        return 0;
    }
};

// GET /api/auth/me — the logged-in user's full profile + activity stats
exports.getMyProfile = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const [rows] = await db.query(
            `SELECT user_id, full_name, email, role,
                    profile_picture_url, headline, bio, phone, location, created_at
             FROM users WHERE user_id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user = rows[0];

        // Activity stats — role-aware, each query is fault-tolerant.
        const [enrolledCount, certificateCount, publishedCount] = await Promise.all([
            safeCount('SELECT COUNT(*) AS count FROM enrollments WHERE student_id = ?', [userId]),
            safeCount('SELECT COUNT(*) AS count FROM certificates WHERE user_id = ?', [userId]),
            safeCount('SELECT COUNT(*) AS count FROM courses WHERE instructor_id = ?', [userId]),
        ]);

        res.status(200).json({
            success: true,
            user,
            stats: {
                courses_enrolled: enrolledCount,
                certificates_earned: certificateCount,
                courses_published: publishedCount,
            },
        });
    } catch (error) {
        console.error('getMyProfile error:', error);
        res.status(500).json({ error: 'Failed to load profile.' });
    }
};

// PUT /api/auth/profile — update editable text fields
exports.updateProfile = async (req, res) => {
    const userId = req.user.user_id;
    const { full_name, headline, bio, phone, location } = req.body;

    if (full_name !== undefined && !String(full_name).trim()) {
        return res.status(400).json({ error: 'Full name cannot be empty.' });
    }

    try {
        await db.query(
            `UPDATE users
             SET full_name = COALESCE(?, full_name),
                 headline  = ?,
                 bio       = ?,
                 phone     = ?,
                 location  = ?
             WHERE user_id = ?`,
            [
                full_name?.trim() || null,
                headline ?? null,
                bio ?? null,
                phone ?? null,
                location ?? null,
                userId,
            ]
        );

        res.status(200).json({ success: true, message: 'Profile updated.' });
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
};

// POST /api/auth/profile/avatar — store the uploaded image path
exports.uploadAvatar = async (req, res) => {
    const userId = req.user.user_id;

    if (!req.file) {
        return res.status(400).json({ error: 'No image file received.' });
    }

    // Public path served by express.static in server.js
    const publicPath = `/uploads/${req.file.filename}`;

    try {
        await db.query(
            'UPDATE users SET profile_picture_url = ? WHERE user_id = ?',
            [publicPath, userId]
        );

        res.status(200).json({
            success: true,
            message: 'Profile photo updated.',
            profile_picture_url: publicPath,
        });
    } catch (error) {
        console.error('uploadAvatar error:', error);
        res.status(500).json({ error: 'Failed to save profile photo.' });
    }
};
