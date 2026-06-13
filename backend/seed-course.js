require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function seedDatabase() {
    let db;
    try {
        const rawData = fs.readFileSync('course-payload.json', 'utf8');
        const payload = JSON.parse(rawData);

        db = await mysql.createConnection({
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });

        // 1. Get Admin ID
        const [users] = await db.query("SELECT user_id FROM users WHERE email = 'naolsisay3@gmail.com'");
        if (users.length === 0) throw new Error("Admin not found.");
        const adminId = users[0].user_id;

        // 2. Clean up previous failed attempts to prevent UNIQUE KEY 'title' crashes
        console.log("Wiping previous partial seed data...");
        await db.query(`DELETE FROM courses WHERE title = ?`, [payload.courseData.title]);

        // 3. Generate UUIDs
        const courseId = crypto.randomUUID();
        const examId = crypto.randomUUID();

        console.log(`Injecting Course: ${payload.courseData.title}...`);

        // STEP 1: Insert Course Metadata
        await db.query(`
            INSERT INTO courses 
            (course_id, instructor_id, title, scope, description, notes, category, price_etb, video_url, thumbnail_url, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')
        `, [
            courseId, adminId, payload.courseData.title, payload.courseData.scope, 
            payload.courseData.description, payload.courseData.notes, payload.courseData.category, 
            payload.courseData.price_etb, payload.courseData.video_url, payload.courseData.thumbnail_url
        ]);

        // Create the linked Exam record with default title to satisfy NOT NULL constraint
        await db.query(`INSERT INTO exams (exam_id, course_id, title) VALUES (?, ?, ?)`, [examId, courseId, 'Final Certification Exam']);

        // STEP 2: Insert Syllabus Structure into course_sections
        console.log("Injecting Curriculum...");
        for (let sIdx = 0; sIdx < payload.syllabus.length; sIdx++) {
            const section = payload.syllabus[sIdx];
            const sectionId = crypto.randomUUID();

            await db.query(`
                INSERT INTO course_sections (section_id, course_id, title, sequence_order) 
                VALUES (?, ?, ?, ?)
            `, [sectionId, courseId, section.title, sIdx]);

            // Insert Materials into course_materials
            for (let mIdx = 0; mIdx < section.materials.length; mIdx++) {
                const mat = section.materials[mIdx];
                const materialId = crypto.randomUUID();

                await db.query(`
                    INSERT INTO course_materials (material_id, section_id, material_type, title, content, sequence_order) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [materialId, sectionId, mat.type, mat.title, mat.content, mIdx]);
            }
        }

        // STEP 3: Insert Exam Questions into exam_questions
        console.log("Injecting Exam Questions...");
        
        // Map frontend "option_a" format to database ENUM 'A' format
        const correctMap = { 'option_a': 'A', 'option_b': 'B', 'option_c': 'C', 'option_d': 'D' };

        for (const q of payload.questions) {
            const questionId = crypto.randomUUID();
            const mappedCorrect = correctMap[q.correct_option];

            await db.query(`
                INSERT INTO exam_questions 
                (question_id, exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                questionId, examId, q.question_text, 
                q.option_a, q.option_b, q.option_c, q.option_d, mappedCorrect
            ]);
        }

        console.log("SUCCESS: Entire course payload seeded successfully.");
    } catch (err) {
        console.error("SEEDING FAILED:", err.message);
    } finally {
        if (db) await db.end();
    }
}

seedDatabase();