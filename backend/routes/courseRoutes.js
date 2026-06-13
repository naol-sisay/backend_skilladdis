const express = require("express");
const router = express.Router();

// --- MIDDLEWARE ---
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// --- CONTROLLERS ---
const {
  createCourse,
  getApprovedCourses,
  getFullCourseSyllabus,
  updateCourseSyllabus,
  getCertificate,
} = require("../controllers/courseController");

const { saveCourseContent } = require("../controllers/courseContentController");

const {
  getExamForCourse,
  getExamQuestions,
  submitExam,
  addQuestionToExam,
} = require("../controllers/examController");

// ==========================================
// ROUTES (Assuming mounted at /api/courses)
// ==========================================

// 1. STATIC ROUTES (Must go first)
router.get("/", getApprovedCourses);
router.post("/create", verifyToken, requireRole("instructor"), createCourse);

// 2. EXAM ROUTES
router.get("/:courseId/exam", getExamForCourse); // Fixed your 404!
router.get("/exams/:examId/questions", getExamQuestions);
router.post("/exams/:examId/submit", verifyToken, submitExam);

// 3. CURRICULUM ROUTES (Dynamic :courseId must go last)
router.get("/:courseId/syllabus", getFullCourseSyllabus);
router.put("/:courseId/syllabus", updateCourseSyllabus);
router.post("/:courseId/content", saveCourseContent);
router.post("/exams/:examId/questions", addQuestionToExam);

router.get("/certificate/:certificateId", getCertificate);
module.exports = router;
