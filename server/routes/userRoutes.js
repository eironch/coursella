import express from "express";

import {
	getSyllabus,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/get-syllabus", getSyllabus);

export default router;
