// controllers/enrollmentController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.enrollInCourse = async (req, res) => {
    // 1. Strict Architecture Gate: Block instructors and admins immediately
    if (req.user.role !== 'student') {
        return res.status(403).json({ 
            error: "Forbidden. Only users with the 'student' role can enroll in courses." 
        });
    }

    const { course_id } = req.body;
    const student_id = req.user.user_id; 

    if (!course_id) {
        return res.status(400).json({ error: 'Course ID is required.' });
    }

    try {
        // 2. Check if the course exists and is approved
        const [courseRows] = await db.query('SELECT price_etb FROM courses WHERE course_id = ? AND status = "approved"', [course_id]);
        if (courseRows.length === 0) {
            return res.status(404).json({ error: 'Course not found or not available for enrollment.' });
        }

        // 3. Check if the student is already enrolled
        const [existingEnrollment] = await db.query('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?', [student_id, course_id]);
        if (existingEnrollment.length > 0) {
            return res.status(409).json({ error: 'You are already enrolled in this course.' });
        }

        const price = courseRows[0].price_etb;
        const payment_status = price > 0 ? 'pending' : 'free';
        const enrollment_id = uuidv4();

        // 4. Create the enrollment
        const query = `
            INSERT INTO enrollments (enrollment_id, student_id, course_id, payment_status) 
            VALUES (?, ?, ?, ?)
        `;
        await db.query(query, [enrollment_id, student_id, course_id, payment_status]);

        res.status(201).json({
            success: true,
            enrollment_id: enrollment_id,
            message: 'Successfully enrolled in course.'
        });

    } catch (error) {
        console.error("Enrollment error:", error);
        res.status(500).json({ error: 'Database error during enrollment.' });
    }
};

exports.getMyCourses = async (req, res) => {
    const student_id = req.user.user_id;

    try {
        // SQL JOIN to fetch the course details alongside the enrollment status
        const query = `
            SELECT c.course_id, c.title, c.thumbnail_url, e.enrolled_at, e.status, e.payment_status 
            FROM enrollments e
            JOIN courses c ON e.course_id = c.course_id
            WHERE e.student_id = ?
        `;
        const [rows] = await db.query(query, [student_id]);

        res.status(200).json({
            success: true,
            my_courses: rows
        });
    } catch (error) {
        console.error("Fetch courses error:", error);
        res.status(500).json({ error: 'Database error fetching your courses.' });
    }
};