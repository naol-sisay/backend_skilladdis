// controllers/examController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// 0. Fetch the exam linked to a specific course
exports.getExamForCourse = async (req, res) => {
    const { courseId } = req.params;
    
    try {
        const [exams] = await db.query('SELECT exam_id FROM exams WHERE course_id = ?', [courseId]);
        
        if (exams.length === 0) {
            return res.status(404).json({ error: 'No exam found for this course.' });
        }

        const examId = exams[0].exam_id;

        // Fetch questions, explicitly excluding correct_option for security
        const [questions] = await db.query(
            'SELECT question_id, question_text, option_a, option_b, option_c, option_d FROM exam_questions WHERE exam_id = ?',
            [examId]
        );

        res.status(200).json({ exam_id: examId, questions });
    } catch (error) {
        console.error("Database error fetching exam:", error);
        res.status(500).json({ error: 'Failed to retrieve exam data.' });
    }
};

// 1. Secure Question Delivery
exports.getExamQuestions = async (req, res) => {
    const { examId } = req.params;
    
    try {
        const [questions] = await db.query(
            'SELECT question_id, question_text, option_a, option_b, option_c, option_d FROM exam_questions WHERE exam_id = ?',
            [examId]
        );
        res.status(200).json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ error: "Database error fetching questions." });
    }
};

// 2. Server-Side Grading and Certification
exports.submitExam = async (req, res) => {
    console.log("DEBUG: Grading process started.");
    try {
        const { examId } = req.params;
        const { answers } = req.body; 
        
        // Ensure userId is handled without crash
        const userId = (req.user && req.user.user_id) ? req.user.user_id : 'test-user-id'; 

        const [examRows] = await db.query("SELECT course_id, minimum_pass_score FROM exams WHERE exam_id = ?", [examId]);
        if (examRows.length === 0) return res.status(404).json({ error: "Exam not found" });
        
        const exam = examRows[0];
        const [questions] = await db.query("SELECT question_id, correct_option FROM exam_questions WHERE exam_id = ?", [examId]);

        let correctCount = 0;
        questions.forEach((q) => {
            const rawUser = String(answers[q.question_id] || "");
            const rawDb = String(q.correct_option || "");
            const extractChar = (str) => { const match = str.toLowerCase().match(/[abcd]/); return match ? match[0] : null; };
            if (extractChar(rawUser) === extractChar(rawDb) && extractChar(rawDb)) correctCount++;
        });

        const scorePercentage = Math.round((correctCount / questions.length) * 100);
        const passed = scorePercentage >= exam.minimum_pass_score;
        let certificate_id = null;

        if (passed) {
            console.log("DEBUG: User passed, generating/fetching certificate.");
            const [existing] = await db.query("SELECT certificate_id FROM certificates WHERE user_id = ? AND course_id = ?", [userId, exam.course_id]);
            
            if (existing.length === 0) {
                certificate_id = uuidv4();
                // If this query fails, it will now trigger the CATCH block
                await db.query("INSERT INTO certificates (certificate_id, user_id, course_id) VALUES (?, ?, ?)", [certificate_id, userId, exam.course_id]);
            } else {
                certificate_id = existing[0].certificate_id;
            }
        }

        console.log("DEBUG: Grading complete, sending response.");
        res.status(200).json({ success: true, score: scorePercentage, passed, certificate_id });

    } catch (error) {
        console.error("DEBUG: CRASH DETECTED. Error:", error);
        res.status(500).json({ error: "Server Error: " + error.message });
    }
};

// Add uuidv4 to your imports if not already there
// const { v4: uuidv4 } = require('uuid');
exports.addQuestionToExam = async (req, res) => {
    try {
        const { examId } = req.params;
        const { question_text, option_a, option_b, option_c, option_d, correct_option } = req.body;

        if (!question_text || !option_a || !option_b || !correct_option) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // FORMATTER: Converts "option_a" into "a", "option_b" into "b"
        const formatted_answer = correct_option.replace('option_', '').toLowerCase(); 

        const question_id = `q-${uuidv4().slice(0, 8)}`; 

        await db.query(
            `INSERT INTO exam_questions 
            (question_id, exam_id, question_text, option_a, option_b, option_c, option_d, correct_option) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            // Pass the formatted_answer instead of the raw correct_option
            [question_id, examId, question_text, option_a, option_b, option_c, option_d, formatted_answer]
        );

        res.status(201).json({ success: true, message: "Question successfully added." });
    } catch (error) {
        console.error("Error adding question:", error);
        res.status(500).json({ error: "Database error while adding question." });
    }
};