const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.markContentComplete = async (req, res) => {
    const { enrollment_id, content_id } = req.body;
    const student_id = req.user.user_id;

    if (!enrollment_id || !content_id) {
        return res.status(400).json({ error: 'Enrollment ID and Content ID are required.' });
    }

    try {
        // 1. Verify this student actually owns this enrollment
        const [enrollment] = await db.query('SELECT * FROM enrollments WHERE enrollment_id = ? AND student_id = ?', [enrollment_id, student_id]);
        if (enrollment.length === 0) {
            return res.status(403).json({ error: 'Unauthorized access to this enrollment.' });
        }

        const progress_id = uuidv4();
        
        // 2. Insert or update the progress record
        const query = `
            INSERT INTO progress (progress_id, enrollment_id, content_id, is_completed, completed_at) 
            VALUES (?, ?, ?, TRUE, CURRENT_TIMESTAMP)
        `;
        
        await db.query(query, [progress_id, enrollment_id, content_id]);

        res.status(200).json({ success: true, message: 'Lesson marked as complete.' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(200).json({ success: true, message: 'Lesson already completed.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Database error updating progress.' });
    }
};