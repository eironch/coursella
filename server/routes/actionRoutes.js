import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/upload.js";

import {
	putInstructorRecord,
	putEvaluationStatus,
	putApprovalStatus,
} from "../controllers/actionController.js";

const router = express.Router();

router.put(
	"/put-instructor-record",
	authMiddleware,
	upload.single("profileImage"),
	putInstructorRecord
);
router.put("/put-evaluation-status", authMiddleware, putEvaluationStatus);
router.put("/put-approval-status", authMiddleware, putApprovalStatus);

export default router;
