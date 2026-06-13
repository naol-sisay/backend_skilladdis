const db = require('../config/db');

exports.approveCourse = async (req, res) => {
    const { course_id } = req.body;
    const admin_id = req.user.user_id; // Requires Admin JWT

    if (!course_id) {
        return res.status(400).json({ error: 'Course ID is required.' });
    }

    try {
        const query = `
            UPDATE courses 
            SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = ? 
            WHERE course_id = ?
        `;
        const [result] = await db.query(query, [admin_id, course_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        res.status(200).json({ success: true, message: 'Course has been approved and is now live.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error approving course.' });
    }
};