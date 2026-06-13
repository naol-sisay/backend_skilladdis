const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.saveCourseContent = async (req, res) => {
    const { courseId } = req.params;
    const { syllabus } = req.body;

    console.log(`Attempting to save content for Course ID: ${courseId}`);

    if (!syllabus || !Array.isArray(syllabus) || syllabus.length === 0) {
        return res.status(400).json({ error: 'Syllabus is empty or invalid.' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Optional: Clear old sections if this is an update (Drop-and-replace)
        await connection.query('DELETE FROM course_sections WHERE course_id = ?', [courseId]);

        for (let i = 0; i < syllabus.length; i++) {
            const section_id = uuidv4();
            const section = syllabus[i];
            
            // 1. Insert into course_sections
            await connection.query(
                'INSERT INTO course_sections (section_id, course_id, title, sequence_order) VALUES (?, ?, ?, ?)',
                [section_id, courseId, section.title, i]
            );

            // 2. Insert into course_materials
            if (section.materials && Array.isArray(section.materials)) {
                for (let j = 0; j < section.materials.length; j++) {
                    const material_id = uuidv4();
                    const mat = section.materials[j];
                    
                    await connection.query(
                        'INSERT INTO course_materials (material_id, section_id, material_type, title, content, sequence_order) VALUES (?, ?, ?, ?, ?, ?)',
                        [material_id, section_id, mat.type || 'video', mat.title, mat.content, j]
                    );
                }
            }
        }

        await connection.commit();
        console.log("Successfully saved syllabus to database.");
        
        res.status(200).json({ success: true, message: 'Content saved successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error('SQL Error while saving content:', error);
        res.status(500).json({ error: 'Failed to save course content to database.' });
    } finally {
        connection.release();
    }
};