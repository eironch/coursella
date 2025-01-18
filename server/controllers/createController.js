import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function postAccount(req, res) {
	const formData = JSON.parse(req.body.data);

	if (!formData)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });
	const { role } = req.user;

	// check if user is instructor
	if (role !== "Admin") return res.status(403).json({ error: "Forbidden: Access denied." });

	// format data
	const userColumns = [
		"email",
		"role",
		"givenName",
		"middleName",
		"familyName",
		"suffix",
		"department",
	];

	const userValues = [
		formData.email,
		formData.role,
		formData.givenName,
		formData.middleName,
		formData.familyName,
		formData.suffix,
		formData.department,
	];

	if (req.file) {
		userColumns.push("profileImage");
		userValues.push(req.file.buffer);
	}

	try {
		// check if email is already used
		const [user] = await db.query(
			`
			SELECT email
			FROM users
			WHERE email = ?
			`,
			[formData.email]
		);

		// respond with error
		if (user.length > 0)
			return res
				.status(409)
				.json({ error: "Email address is already used.", isEmailAlreadyUsed: true });

		// encrypt password
		const hashedPassword = await bcrypt.hash(formData.password, 8);

		// insert into users
		await db.query(
			`
			INSERT INTO users (password, ${userColumns.join(", ")}) 
			VALUES (?, ${userColumns.map(() => "?").join(", ")})
			`,
			[hashedPassword, ...userValues]
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created an account." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postMessage(req, res) {
	// recieve info from user
	const { message, recipientId, senderId } = req.body;

	if (!message || !recipientId || !senderId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor or admin
	if (role !== "Instructor" && role !== "Coordinator" && role !== "Admin")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// insert into message
		await db.query(
			`
			INSERT INTO messages (message, recipientId, senderId)
			VALUES (?, ?, ?)
			`,
			[message, recipientId, senderId]
		);

		// get messages
		const [messages] = await db.query(
			`
			SELECT message, messageId, messageType, createdDate
			FROM (
				SELECT message, messageId, 'sent' AS messageType, createdDate
				FROM (
					SELECT message, messageId, createdDate
					FROM messages
					WHERE recipientId = ? AND senderId = ?
					ORDER BY createdDate DESC
					LIMIT 20
				) AS sentMessages

				UNION ALL

				SELECT message, messageId, 'received' AS messageType, createdDate
				FROM (
					SELECT message, messageId, createdDate
					FROM messages
					WHERE recipientId = ? AND senderId = ?
					ORDER BY createdDate DESC
					LIMIT 20
				) AS receivedMessages
			) AS combinedMessages
			ORDER BY createdDate DESC, messageId DESC
			LIMIT 20
			`,
			[recipientId, senderId, senderId, recipientId]
		);

		// update newest message to read
		await db.query(
			`
			UPDATE messages
			SET isRead = true
			WHERE messageId = (
				SELECT messageId
				FROM messages
				WHERE recipientId = ?
				AND senderId = ?
				ORDER BY createdDate DESC
				LIMIT 1
			)
			`,
			[senderId, recipientId]
		);

		// respond with success
		return res
			.status(200)
			.json({ payload: messages.reverse(), message: "You have successfully sent a message." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postWebReferences(req, res) {
	// recieve info from user
	const { syllabusId, webRefs } = req.body;

	if (!syllabusId || !webRefs)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["syllabusId", "webRef"];

	const values = webRefs.map((value) => [syllabusId, value.webRef]);

	try {
		await db.query(
			`
			INSERT INTO web_references (${columns.join(", ")})
			VALUES ${webRefs.map(() => "(?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created web references." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postPreviousModules(req, res) {
	// recieve info from user
	const { syllabusId, prevModules } = req.body;

	if (!syllabusId || !prevModules)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["syllabusId", "prevModule"];

	const values = prevModules.map((value) => [syllabusId, value.prevModule]);

	try {
		await db.query(
			`
			INSERT INTO previous_modules (${columns.join(", ")})
			VALUES ${prevModules.map(() => "(?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created previous modules." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postReferenceBooks(req, res) {
	// recieve info from user
	const { syllabusId, refBooks } = req.body;

	if (!syllabusId || !refBooks)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["syllabusId", "refBook"];

	const values = refBooks.map((value) => [syllabusId, value.refBook]);

	try {
		await db.query(
			`
			INSERT INTO reference_books (${columns.join(", ")})
			VALUES ${refBooks.map(() => "(?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created reference books." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postCourseCoverages(req, res) {
	// recieve info from user
	const { syllabusId, coverages } = req.body;

	if (!syllabusId || !coverages)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = [
		"syllabusId",
		"weekNo",
		"ilo",
		"topic",
		"tla",
		"modeOfDelivery",
		"resourcesNeeded",
		"oba",
		"outputDueDate",
	];

	const values = coverages.map((coverage, index) => [
		syllabusId,
		index + 1,
		coverage.ilo,
		coverage.topic,
		coverage.tla,
		coverage.modeOfDelivery,
		coverage.resourcesNeeded,
		coverage.oba,
		coverage.outputDueDate ? coverage.outputDueDate : null,
	]);

	try {
		await db.query(
			`
			INSERT INTO course_coverages (${columns.join(", ")})
			VALUES ${coverages.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created course coverages." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postCourseOutcomes(req, res) {
	// recieve info from user
	const { syllabusId, outcomes } = req.body;

	if (!syllabusId || !outcomes)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["outcomes", "syllabusId", "outComeCodes"];

	const values = outcomes.map((outcome) => [
		outcome.value,
		syllabusId,
		outcome.codes.map((code) => (code ? 1 : 0)).join(""),
	]);

	try {
		await db.query(
			`
			INSERT INTO course_outcomes (${columns.join(", ")})
			VALUES ${outcomes.map(() => "(?, ?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created course outcomes." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postCourseSchedules(req, res) {
	// recieve info from user
	const { syllabusId, schedules } = req.body;

	if (!syllabusId || !schedules)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = [
		"assignedSection",
		"syllabusId",
		"programName",
		"lectureSchedule",
		"laboratorySchedule",
	];

	try {
		const values = schedules.map((schedule) => [
			schedule.assignedSection,
			syllabusId,
			schedule.programName,
			schedule.lectureSchedule,
			schedule.laboratorySchedule,
		]);

		await db.query(
			`
			INSERT INTO course_schedules (${columns.join(", ")})
			VALUES ${schedules.map(() => "(?, ?, ?, ?, ?)").join(", ")}
			`,
			values.flat()
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully created course schedules." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function postSyllabus(req, res) {
	// recieve info from user
	const { targetId, syllabus } = req.body;

	if (!targetId || !syllabus)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = [
		"syllabusId",
		"programName",
		"courseCode",
		"courseTitle",
		"isLecture",
		"isLaboratory",
		"creditUnits",
		"courseDescription",
		"prerequisite",
		"gradingSystem",
		"userId",
		"semester",
		"enrollmentYear",
	];

	try {
		// get enrollment year and semester
		const [[{ enrollmentYear, semester }]] = await db.query(
			`
			SELECT enrollmentYear, semester
			FROM enrollment_details
			`
		);

		const syllabusId = uuidv4();

		const values = [
			syllabusId,
			syllabus.programName,
			syllabus.courseCode,
			syllabus.courseTitle,
			syllabus.isLecture === "true" ? true : false,
			syllabus.isLaboratory === "true" ? true : false,
			syllabus.creditUnits,
			syllabus.courseDescription,
			syllabus.prerequisite,
			syllabus.gradingSystem,
			targetId,
			semester,
			enrollmentYear,
		];

		// insert syllabus
		await db.query(
			`
			INSERT INTO syllabi (${columns.join(", ")})
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`,
			values
		);

		// respond with success
		return res.status(200).json({
			payload: syllabusId,
			message: "You have successfully created a course syllabus.",
		});
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
