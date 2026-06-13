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
// ROUTES (Mounted at /api/courses)
// ==========================================

// 1. PUBLIC ROUTES (Safe to expose to unauthenticated traffic)
router.get("/", getApprovedCourses);
router.get("/certificate/:certificateId", getCertificate);
router.get("/:courseId/exam", getExamForCourse); 
router.get("/exams/:examId/questions", getExamQuestions);
router.get("/:courseId/syllabus", getFullCourseSyllabus);

// 2. INSTRUCTOR ROUTES (Strictly locked to verified instructors)
router.post("/create", verifyToken, requireRole("instructor"), createCourse);
router.put("/:courseId/syllabus", verifyToken, requireRole("instructor"), updateCourseSyllabus);
router.post("/:courseId/content", verifyToken, requireRole("instructor"), saveCourseContent);
router.post("/exams/:examId/questions", verifyToken, requireRole("instructor"), addQuestionToExam);

// 3. STUDENT ROUTES (Locked to authenticated users taking the exam)
// Note: We do not require the "instructor" role here, as students must be able to submit.
router.post("/exams/:examId/submit", verifyToken, submitExam);

module.exports = router;