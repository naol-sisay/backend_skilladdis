const db = require('../config/db');

/* =====================================================================
   SkillAddis — Admin / Superadmin controller
   All handlers below are mounted behind verifyToken + requireRole('admin').
   The MySQL schema uses ON DELETE CASCADE everywhere, so deleting a user
   or a course cleanly removes their dependent rows (courses, enrollments,
   sections, materials, exams, certificates, progress…).
   ===================================================================== */

// ---------------------------------------------------------------------
// Overview metrics for the dashboard cards
// ---------------------------------------------------------------------
exports.getStats = async (req, res) => {
    try {
        const [[users]] = await db.query(
            `SELECT
                COUNT(*) AS total,
                SUM(role = 'student') AS students,
                SUM(role = 'instructor') AS instructors,
                SUM(role = 'admin') AS admins
             FROM users`
        );
        const [[courses]] = await db.query(
            `SELECT
                COUNT(*) AS total,
                SUM(status = 'approved') AS approved,
                SUM(status = 'pending_approval') AS pending,
                SUM(status = 'rejected') AS rejected,
                SUM(status = 'archived') AS archived
             FROM courses`
        );
        const [[enroll]] = await db.query(`SELECT COUNT(*) AS total FROM enrollments`);

        res.json({
            users: {
                total: Number(users.total) || 0,
                students: Number(users.students) || 0,
                instructors: Number(users.instructors) || 0,
                admins: Number(users.admins) || 0,
            },
            courses: {
                total: Number(courses.total) || 0,
                approved: Number(courses.approved) || 0,
                pending: Number(courses.pending) || 0,
                rejected: Number(courses.rejected) || 0,
                archived: Number(courses.archived) || 0,
            },
            enrollments: Number(enroll.total) || 0,
        });
    } catch (error) {
        console.error('admin getStats:', error);
        res.status(500).json({ error: 'Failed to load stats.' });
    }
};

// ---------------------------------------------------------------------
// Users — list (with optional ?search=) and per-user course/enrollment counts
// ---------------------------------------------------------------------
exports.getUsers = async (req, res) => {
    const { search = '' } = req.query;
    try {
        const like = `%${search}%`;
        const [rows] = await db.query(
            `SELECT
                u.user_id, u.full_name, u.email, u.role,
                u.is_approved_instructor, u.created_at, u.last_login,
                u.profile_picture_url,
                (SELECT COUNT(*) FROM courses c WHERE c.instructor_id = u.user_id) AS courses_count,
                (SELECT COUNT(*) FROM enrollments e WHERE e.student_id = u.user_id) AS enrollments_count
             FROM users u
             WHERE (? = '' OR u.full_name LIKE ? OR u.email LIKE ?)
             ORDER BY u.created_at DESC`,
            [search, like, like]
        );
        res.json({ users: rows });
    } catch (error) {
        console.error('admin getUsers:', error);
        res.status(500).json({ error: 'Failed to load users.' });
    }
};

// ---------------------------------------------------------------------
// Users — change role (student | instructor | admin)
// ---------------------------------------------------------------------
exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const allowed = ['student', 'instructor', 'admin'];

    if (!allowed.includes(role)) {
        return res.status(400).json({ error: 'Invalid role.' });
    }
    if (id === req.user.user_id) {
        return res.status(400).json({ error: 'You cannot change your own role.' });
    }

    try {
        const [result] = await db.query('UPDATE users SET role = ? WHERE user_id = ?', [role, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ success: true, message: 'Role updated.' });
    } catch (error) {
        console.error('admin updateUserRole:', error);
        res.status(500).json({ error: 'Failed to update role.' });
    }
};

// ---------------------------------------------------------------------
// Users — delete (cascades to their courses / enrollments)
// ---------------------------------------------------------------------
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    if (id === req.user.user_id) {
        return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    try {
        const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.json({ success: true, message: 'User removed.' });
    } catch (error) {
        console.error('admin deleteUser:', error);
        res.status(500).json({ error: 'Failed to remove user.' });
    }
};

// ---------------------------------------------------------------------
// Courses — list ALL (any status) with instructor name + enrollment count
// ---------------------------------------------------------------------
exports.getCourses = async (req, res) => {
    const { search = '' } = req.query;
    try {
        const like = `%${search}%`;
        const [rows] = await db.query(
            `SELECT
                c.course_id, c.title, c.category, c.price_etb, c.status,
                c.thumbnail_url, c.scope, c.description, c.created_at, c.instructor_id,
                u.full_name AS instructor_name,
                (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id) AS enrollments_count
             FROM courses c
             LEFT JOIN users u ON u.user_id = c.instructor_id
             WHERE (? = '' OR c.title LIKE ? OR c.category LIKE ?)
             ORDER BY c.created_at DESC`,
            [search, like, like]
        );
        res.json({ courses: rows });
    } catch (error) {
        console.error('admin getCourses:', error);
        res.status(500).json({ error: 'Failed to load courses.' });
    }
};

// ---------------------------------------------------------------------
// Courses — edit (title, description, category, price, scope, status)
// ---------------------------------------------------------------------
exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, price_etb, scope, status } = req.body;
    const allowedStatus = ['pending_approval', 'approved', 'rejected', 'archived'];

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({ error: 'Invalid status.' });
    }

    try {
        // Build a partial update from whichever fields were supplied.
        const fields = [];
        const values = [];
        const set = (col, val) => { fields.push(`${col} = ?`); values.push(val); };

        if (title !== undefined) set('title', title);
        if (description !== undefined) set('description', description);
        if (category !== undefined) set('category', category);
        if (price_etb !== undefined) set('price_etb', price_etb);
        if (scope !== undefined) set('scope', scope);
        if (status !== undefined) {
            set('status', status);
            if (status === 'approved') {
                set('approved_at', new Date());
                set('approved_by', req.user.user_id);
            }
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        values.push(id);
        const [result] = await db.query(
            `UPDATE courses SET ${fields.join(', ')} WHERE course_id = ?`,
            values
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        res.json({ success: true, message: 'Course updated.' });
    } catch (error) {
        console.error('admin updateCourse:', error);
        res.status(500).json({ error: 'Failed to update course.' });
    }
};

// ---------------------------------------------------------------------
// Courses — delete (cascades to sections, materials, exams, enrollments…)
// ---------------------------------------------------------------------
exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM courses WHERE course_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        res.json({ success: true, message: 'Course removed.' });
    } catch (error) {
        console.error('admin deleteCourse:', error);
        res.status(500).json({ error: 'Failed to remove course.' });
    }
};

// ---------------------------------------------------------------------
// Courses — quick approve (kept for backward compatibility)
// ---------------------------------------------------------------------
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
        console.error('admin approveCourse:', error);
        res.status(500).json({ error: 'Database error approving course.' });
    }
};
