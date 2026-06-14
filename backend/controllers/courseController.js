// controllers/courseController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createCourse = async (req, res) => {
    const { title, scope, description, notes, category, price_etb, video_url, thumbnail_url } = req.body;
    const instructor_id = req.user.user_id; 

    if (!title || !description || !category || price_etb === undefined || !video_url) {
        return res.status(400).json({ error: 'Missing required fields. Video URL is mandatory.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const course_id = uuidv4();
        const exam_id = `exam-${uuidv4().slice(0, 8)}`; 
        const status = 'approved'; 

        const courseQuery = `
            INSERT INTO courses 
            (course_id, instructor_id, title, scope, description, notes, category, price_etb, video_url, thumbnail_url, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(courseQuery, [course_id, instructor_id, title, scope, description, notes, category, price_etb, video_url, thumbnail_url, status]);

        const examQuery = `
            INSERT INTO exams (exam_id, course_id, minimum_pass_score) 
            VALUES (?, ?, ?)
        `;
        await connection.query(examQuery, [exam_id, course_id, 70]);

        await connection.commit();

        res.status(201).json({
            success: true,
            course_id: course_id,
            exam_id: exam_id, 
            status: status,
            message: 'Course and Exam initialized successfully.'
        });

    } catch (error) {
        await connection.rollback(); 
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'A course with this title already exists.' });
        }
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'Database error while creating course and exam.' });
    } finally {
        connection.release(); 
    }
};

exports.getApprovedCourses = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let query = `
            SELECT course_id, title, scope, description, notes, category, price_etb, instructor_id, video_url, thumbnail_url 
            FROM courses 
            WHERE status = 'approved'
        `;
        let queryParams = [];

        if (searchQuery) {
            query += ` AND (title LIKE ? OR description LIKE ? OR category LIKE ?)`;
            const likeTerm = `%${searchQuery}%`;
            queryParams.push(likeTerm, likeTerm, likeTerm);
        }

        query += ` ORDER BY created_at DESC`;

        const [rows] = await db.query(query, queryParams);

        res.status(200).json({
            success: true,
            courses: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Fetch Courses Error:', error);
        res.status(500).json({ error: 'Database error while fetching courses.' });
    }
};

exports.getFullCourseSyllabus = async (req, res) => {
    const { courseId } = req.params;

    try {
        // 1. Fetch Course Metadata
        const [courseRows] = await db.query("SELECT * FROM courses WHERE course_id = ? AND status = 'approved'", [courseId]);
        if (courseRows.length === 0) return res.status(404).json({ error: 'Course not found' });
        const course = courseRows[0];

        // 2. Fetch Sections
        const [sections] = await db.query('SELECT section_id, title FROM course_sections WHERE course_id = ? ORDER BY sequence_order ASC', [courseId]);

        // 3. Fetch Materials efficiently (preventing empty array SQL crashes)
        let materials = [];
        if (sections.length > 0) {
            const sectionIds = sections.map(s => s.section_id);
            // Alias material_type to type so React handles it properly
            const [mats] = await db.query('SELECT material_id, section_id, material_type as type, title, content FROM course_materials WHERE section_id IN (?) ORDER BY sequence_order ASC', [sectionIds]);
            materials = mats;
        }

        // 4. Fetch Exam Metadata
        const [exams] = await db.query('SELECT exam_id, title, minimum_pass_score FROM exams WHERE course_id = ?', [courseId]);

        // 5. Assemble Hierarchical Tree
        const syllabus = sections.map(section => ({
            section_id: section.section_id,
            title: section.title,
            materials: materials.filter(m => m.section_id === section.section_id)
        }));

        // Your CoursePlayer.jsx expects res.data.course and res.data.syllabus
        res.status(200).json({
            success: true,
            course: course,
            syllabus: syllabus,
            exam: exams[0] || null
        });

    } catch (error) {
        console.error('Syllabus Assembly Error:', error);
        res.status(500).json({
            error: 'Failed to construct course hierarchy.',
            // Surfaced to help diagnose prod-only failures (schema drift, bad data).
            detail: error.sqlMessage || error.message,
            code: error.code,
        });
    }
};

exports.updateCourseSyllabus = async (req, res) => {
    const { courseId } = req.params;
    const { syllabus } = req.body; 

    if (!syllabus || !Array.isArray(syllabus)) {
        return res.status(400).json({ error: 'Invalid syllabus payload.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction(); 

        await connection.query('DELETE FROM course_sections WHERE course_id = ?', [courseId]);

        for (let i = 0; i < syllabus.length; i++) {
            const section_id = uuidv4();
            const section = syllabus[i];
            
            await connection.query(
                'INSERT INTO course_sections (section_id, course_id, title, sequence_order) VALUES (?, ?, ?, ?)',
                [section_id, courseId, section.title || `Section ${i + 1}`, i]
            );

            if (section.materials && Array.isArray(section.materials)) {
                for (let j = 0; j < section.materials.length; j++) {
                    const material_id = uuidv4();
                    const mat = section.materials[j];
                    
                    await connection.query(
                        'INSERT INTO course_materials (material_id, section_id, material_type, title, content, sequence_order) VALUES (?, ?, ?, ?, ?, ?)',
                        [material_id, section_id, mat.type || 'video', mat.title || `Lesson ${j + 1}`, mat.content, j]
                    );
                }
            }
        }

        await connection.commit(); 

        res.status(200).json({
            success: true,
            message: 'Course curriculum synced successfully.'
        });

    } catch (error) {
        await connection.rollback(); 
        console.error('Update Syllabus Error:', error);
        res.status(500).json({ error: 'Database transaction failed during syllabus update.' });
    } finally {
        connection.release(); 
    }
};

exports.getCertificate = async (req, res) => {
    const { certificateId } = req.params;
    
    try {
        const [certRows] = await db.query("SELECT * FROM certificates WHERE certificate_id = ?", [certificateId]);
        if (certRows.length === 0) return res.status(404).json({ error: "Certificate not found." });
        
        const cert = certRows[0];

        const [userRows] = await db.query("SELECT full_name FROM users WHERE user_id = ?", [cert.user_id]);
        const studentName = userRows.length > 0 ? userRows[0].full_name : "Unknown Student";

       const [courseRows] = await db.query("SELECT * FROM courses WHERE course_id = ? AND status = 'approved'", [courseId]);
        const courseTitle = courseRows.length > 0 ? courseRows[0].title : "SkillAddis Course";

        res.status(200).json({
            certificate_id: cert.certificate_id,
            student_name: studentName,
            course_title: courseTitle,
            issued_at: cert.issued_at
        });
    } catch (error) {
        console.error("Certificate DB Error:", error);
        res.status(500).json({ error: "Failed to generate certificate data." });
    }
};