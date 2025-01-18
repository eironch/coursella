import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
	getExamSchedules,
	getAvailableCourses,
	getInstructorRecord,
	getInstructorBasic,
	getSyllabi,
	getSyllabus,
	getMessages,
	getRecipients,
	getCourseCodes,
	getFindRecipient,
	getFindSyllabi,
	getSyllabiInstructor,
	getFindSyllabiInstructor,
	getCourses,
	getFindCourses,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/get-exam-schedules", authMiddleware, getExamSchedules);
router.get("/get-available-courses", authMiddleware, getAvailableCourses);
router.get("/get-instructor-record", authMiddleware, getInstructorRecord);
router.get("/get-instructor-basic", authMiddleware, getInstructorBasic);
router.get("/get-syllabi", authMiddleware, getSyllabi);
router.get("/get-syllabi-instructor", authMiddleware, getSyllabiInstructor);
router.get("/get-syllabus", authMiddleware, getSyllabus);
router.get("/get-messages", authMiddleware, getMessages);
router.get("/get-recipients", authMiddleware, getRecipients);
router.get("/get-course-codes", authMiddleware, getCourseCodes);
router.get("/get-find-recipient", authMiddleware, getFindRecipient);
router.get("/get-find-syllabi-instructor", authMiddleware, getFindSyllabiInstructor);
router.get("/get-find-syllabi", authMiddleware, getFindSyllabi);
router.get("/get-courses", authMiddleware, getCourses);
router.get("/get-find-courses", authMiddleware, getFindCourses);

export default router;
