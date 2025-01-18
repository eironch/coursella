import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/upload.js";

import {
	postCourseCoverages,
	postCourseOutcomes,
	postCourseSchedules,
	postMessage,
	postPreviousModules,
	postReferenceBooks,
	postSyllabus,
	postWebReferences,
	postAccount,
} from "../controllers/createController.js";

const router = express.Router();

router.post("/post-syllabus", authMiddleware, postSyllabus);
router.post("/post-course-schedules", authMiddleware, postCourseSchedules);
router.post("/post-course-outcomes", authMiddleware, postCourseOutcomes);
router.post("/post-course-coverages", authMiddleware, postCourseCoverages);
router.post("/post-reference-books", authMiddleware, postReferenceBooks);
router.post("/post-previous-modules", authMiddleware, postPreviousModules);
router.post("/post-web-references", authMiddleware, postWebReferences);
router.post("/post-message", authMiddleware, postMessage);
router.post(
	"/post-account",
	authMiddleware,
	upload.single("profileImage"),
	postAccount
);

export default router;
