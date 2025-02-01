import db from "../config/db.js";

import { getPreferredProgram, getIsCourseAvailable } from "../utils/utils.js";

export async function getFindCourses(req, res) {
	// receive info from user
	const { programName, courseYear, courseSem, searchQuery, searchParams } = req.query;

	if (!programName || !courseYear || !courseSem || !searchQuery)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Admin") return res.status(403).json({ error: "Forbidden: Access denied." });

	const paramColumns = {
		"Course Code": "courseCode",
		"Course Title": "courseTitle",
		"Credit Unit<br>(LEC)": "creditUnitLec",
		"Credit Unit<br>(LAB)": "creditUnitLab",
		"Contact Hrs<br>(LEC)": "contactHrsLec",
		"Contact Hrs<br>(LAB)": "contactHrsLab",
		"Pre-requisite": "prerequisite",
	};

	const columns = [
		"courseCode",
		"courseTitle",
		"creditUnitLec",
		"creditUnitLab",
		"contactHrsLec",
		"contactHrsLab",
		"prerequisite",
	];

	try {
		// get academic records
		const [academicRecord] = await db.query(
			`
			SELECT *
			FROM courses
			WHERE LOWER(CONCAT_WS(' ', ${
				searchParams
					? searchParams.map((param) => paramColumns[param]).join(", ")
					: columns.join(", ")
			})) LIKE LOWER(?)
			AND courseYear = ?
			AND courseSem = ?
			AND programName = ?
			`,
			[`%${searchQuery}%`, courseYear, courseSem, programName]
		);

		const payload = academicRecord.map((record) => ({
			courseCode: record.courseCode,
			courseTitle: record.courseTitle,
			creditUnitLec: record.creditUnitLec,
			creditUnitLab: record.creditUnitLab,
			contactHrsLec: record.contactHrsLec,
			contactHrsLab: record.contactHrsLab,
			prerequisite: record.prerequisite,
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Courses found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getCourses(req, res) {
	// receive info from user
	const { programName, courseYear, courseSem } = req.query;

	if (!programName || !courseYear || !courseSem)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Admin") return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// get academic records
		const [academicRecord] = await db.query(
			`
			SELECT *
			FROM courses 
			WHERE courseYear = ?
			AND courseSem = ?
			AND programName = ?
			`,
			[courseYear, courseSem, programName]
		);

		const payload = academicRecord.map((record) => ({
			courseCode: record.courseCode,
			courseTitle: record.courseTitle,
			creditUnitLec: record.creditUnitLec,
			creditUnitLab: record.creditUnitLab,
			contactHrsLec: record.contactHrsLec,
			contactHrsLab: record.contactHrsLab,
			prerequisite: record.prerequisite,
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Courses found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getFindSyllabi(req, res) {
	// receive info from user
	const { programName, searchQuery, searchParams } = req.query;

	if (!programName || !searchQuery)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is instructor, admin, or coordinator
	const { role } = req.user;

	if (role !== "Admin" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const paramColumns = {
		"Course Code": "courseCode",
		"Course Title": "courseTitle",
		Semester: "semester",
		"Academic Year": "enrollmentYear",
		"Prepared Date": "datePrepared",
	};

	const columns = [
		"s.syllabusId",
		"s.courseCode",
		"s.courseTitle",
		"s.semester",
		"s.enrollmentYear",
		"s.datePrepared",
		"u.givenName",
		"u.middleName",
		"u.familyName",
		"u.suffix",
	];

	try {
		// query for recipient
		const [syllabi] = await db.query(
			`
			SELECT ${columns.join(", ")}
			FROM syllabi s
			JOIN users u
				ON u.userId = s.userId
			WHERE LOWER(CONCAT_WS(' ', ${
				searchParams
					? searchParams.map((param) => paramColumns[param]).join(", ")
					: columns.join(", ")
			})) LIKE LOWER(?)
			${role === "Coordinator" ? "AND evaluationStatus = 'Pending'" : ""}
			${role === "Admin" ? "AND evaluationStatus = 'Approved' AND approvalStatus = 'Pending'" : ""}
			AND s.programName = ?
			`,
			[`%${searchQuery}%`, programName]
		);

		const payload = syllabi.map((syllabus) => ({
			syllabusId: syllabus.syllabusId,
			courseCode: syllabus.courseCode,
			courseTitle: syllabus.courseTitle,
			semester: syllabus.semester,
			enrollmentYear: syllabus.enrollmentYear,
			datePrepared: syllabus.datePrepared.toISOString().split("T")[0],
			instructorName:
				syllabus.familyName +
				", " +
				syllabus.givenName +
				" " +
				syllabus.middleName +
				(syllabus.suffix !== null ? " " + syllabus.suffix : ""),
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Syllabi successfully found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getFindSyllabiInstructor(req, res) {
	// receive info from user
	const { targetId, searchQuery, searchParams } = req.query;

	if (!targetId || !searchQuery)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is instructor, admin, or coordinator
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Admin" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const paramColumns = {
		"Course Code": "courseCode",
		"Course Title": "courseTitle",
		Semester: "semester",
		"Academic Year": "enrollmentYear",
		"Prepared Date": "datePrepared",
	};

	const columns = [
		"syllabusId",
		"courseCode",
		"courseTitle",
		"semester",
		"enrollmentYear",
		"datePrepared",
	];

	try {
		// query for recipient
		const [syllabi] = await db.query(
			`
			SELECT ${columns.join(", ")}
			FROM syllabi
			WHERE LOWER(CONCAT_WS(' ', ${
				searchParams
					? searchParams.map((param) => paramColumns[param]).join(", ")
					: columns.join(", ")
			})) LIKE LOWER(?)
			AND userId = ?
			`,
			[`%${searchQuery}%`, targetId]
		);

		const payload = syllabi.map((syllabus) => ({
			syllabusId: syllabus.syllabusId,
			courseCode: syllabus.courseCode,
			courseTitle: syllabus.courseTitle,
			semester: syllabus.semester,
			enrollmentYear: syllabus.enrollmentYear,
			datePrepared: syllabus.datePrepared.toISOString().split("T")[0],
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Syllabi successfully found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getFindRecipient(req, res) {
	// receive info from user
	const { targetId, searchQuery } = req.query;

	if (!targetId || !searchQuery)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is instructor, admin, or coordinator
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Admin" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["givenName", "middleName", "familyName", "suffix", "role"];

	try {
		// query for recipient
		const [recipients] = await db.query(
			`
			SELECT userId, ${columns.join(", ")}
			FROM users
			WHERE CONCAT_WS(' ', ${columns.join(", ")}) LIKE ?
			AND role IN ("Instructor", "Coordinator", "Admin")
			AND userId != ?
			`,
			[`%${searchQuery}%`, targetId]
		);

		const payload = recipients.map((recipient) => ({
			userId: recipient.userId,
			fullName:
				recipient.familyName +
				", " +
				recipient.givenName +
				" " +
				recipient.middleName +
				(recipient.suffix !== null ? " " + recipient.suffix : ""),
			role: recipient.role,
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Syllabi successfully found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getCourseCodes(req, res) {
	// receive info from user
	const { programName } = req.query;

	if (!programName)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// query for course codes info
		const [courseCodes] = await db.query(
			`
			SELECT courseCode
			FROM courses
			WHERE programName = ?
			`,
			[programName]
		);

		const payload = courseCodes.map((courseCode) => courseCode.courseCode);

		// respond with success
		return res.status(200).json({ payload, message: "Course codes successfully found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getRecipients(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Instructor" && role !== "Coordinator" && role !== "Admin")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// get recent interactions
		const [recentInteractions] = await db.query(
			`
			SELECT 
				MAX(createdDate) AS createdDate,
				CASE 
						WHEN senderId = ? THEN recipientId
						ELSE senderId
				END AS otherUserId
			FROM messages
			WHERE recipientId = ? OR senderId = ?
			GROUP BY otherUserId
			ORDER BY createdDate DESC
			LIMIT 10
			`,
			[targetId, targetId, targetId]
		);
		const payload = [];

		for (const interaction of recentInteractions) {
			// get recent message
			const [[message]] = await db.query(
				`
				SELECT 
					m.message, 
					m.messageId,
					m.isRead,
					m.createdDate,
					CASE 
						WHEN m.recipientId = ? THEN 'received'
						WHEN m.senderId = ? THEN 'sent'
					END AS messageType,
					CASE 
						WHEN m.recipientId = ? THEN m.senderId
						WHEN m.senderId = ? THEN m.recipientId
					END AS recipientId,
					u.givenName,
					u.middleName,
					u.familyName,
					u.suffix,
					u.role,
					u.profileImage
				FROM messages m
				JOIN users u
					ON ((u.userId = m.recipientId AND m.recipientId != ?) 
    			OR (u.userId = m.senderId AND m.senderId != ?))
				WHERE (m.recipientId = ? AND m.senderId = ?) 
					OR (m.recipientId = ? AND m.senderId = ?)
				ORDER BY m.createdDate DESC, m.messageId DESC
				LIMIT 1;
				`,
				[
					targetId,
					targetId,
					targetId,
					targetId,
					targetId,
					targetId,
					targetId,
					interaction.otherUserId,
					interaction.otherUserId,
					targetId,
				]
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
				[targetId, interaction.otherUserId]
			);

			if (message) {
				message.fullName =
					message.givenName +
					" " +
					message.middleName +
					" " +
					message.familyName +
					(message.suffix !== null ? " " + message.suffix : "");
				message.isNewMessage = message.isNewMessage === "true" || message.isNewMessage === true;

				payload.push(message);
			}
		}

		// respond with success
		return res.status(200).json({ payload, message: "Recipients successfully found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getMessages(req, res) {
	// receive info from user
	const { recipientId, senderId } = req.query;

	if (!recipientId || !senderId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Instructor" && role !== "Coordinator" && role !== "Admin")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
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
			[recipientId, senderId]
		);

		// respond with success
		return res
			.status(200)
			.json({ payload: messages.reverse(), message: "Successfully found messages." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getSyllabus(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Coordinator" && role !== "Admin")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const syllabusColumns = [
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
		"datePrepared",
		"dateEvaluated",
		"dateApproved",
		"semester",
		"enrollmentYear",
		"userId",
	];
	const schedulesColumns = [
		"courseSchedId",
		"assignedSection",
		"programName",
		"lectureSchedule",
		"laboratorySchedule",
	];
	const outcomesColumns = ["outcomeId", "outcomes", "outcomeCodes"];
	const coveragesColumns = [
		"weekNo",
		"ilo",
		"topic",
		"tla",
		"modeOfDelivery",
		"resourcesNeeded",
		"oba",
		"outputDueDate",
	];
	const refBooksColumns = ["refBookId", "refBook"];
	const prevModulesColumns = ["prevModuleId", "prevModule"];
	const webRefsColumns = ["webRefId", "webRef"];

	const userColumns = [
		"u.givenName",
		"u.middleName",
		"u.familyName",
		"u.suffix",
		"p.contactNum",
		"u.department",
	];

	try {
		// get the syllabus info
		const [[syllabus]] = await db.query(
			`
			SELECT ${syllabusColumns.join(", ")}
			FROM syllabi 
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the schedules info
		const [schedules] = await db.query(
			`
			SELECT ${schedulesColumns.join(", ")}
			FROM course_schedules
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the outcomes info
		const [outcomes] = await db.query(
			`
			SELECT ${outcomesColumns.join(", ")}
			FROM course_outcomes
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the coverages info
		const [coverages] = await db.query(
			`
			SELECT ${coveragesColumns.join(", ")}
			FROM course_coverages
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the refeference books info
		const [refBooks] = await db.query(
			`
			SELECT ${refBooksColumns.join(", ")}
			FROM reference_books
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the previous modules info
		const [prevModules] = await db.query(
			`
			SELECT ${prevModulesColumns.join(", ")}
			FROM previous_modules
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// get the web references info
		const [webRefs] = await db.query(
			`
			SELECT ${webRefsColumns.join(", ")}
			FROM web_references
			WHERE syllabusId = ?
			`,
			[targetId]
		);

		// query for user info
		const [[user]] = await db.query(
			`
			SELECT ${userColumns.join(", ")}
			FROM users u
			JOIN personnel p
				ON p.userId = u.userId
			WHERE u.userId = ?
			`,
			[syllabus.userId]
		);

		// format data for client
		const payload = {
			syllabus: {
				...syllabus,
				isLecture: syllabus.isLecture === 1,
				isLaboratory: syllabus.isLaboratory === 1,
			},
			schedules,
			outcomes: outcomes.map((outcome) => ({
				...outcome,
				value: outcome.outcomes,
				codes: outcome.outcomeCodes.split("").map((code) => code === "1"),
			})),
			coverages: coverages.map((coverage) => ({
				...coverage,
				outputDueDate: coverage.outputDueDate?.toISOString().split("T")[0],
			})),
			refBooks,
			prevModules,
			webRefs,
			preparedBy: {
				fullName:
					user.familyName +
					", " +
					user.givenName +
					" " +
					user.middleName +
					(user.suffix !== null ? " " + user.suffix : ""),
				email: user.contactNum,
				department: user.department,
				datePrepared: syllabus.datePrepared.toISOString().split("T")[0],
			},
		};

		// respond with all data
		return res.status(200).json({
			payload,
			message: "Syllabus retrieved successfully.",
		});
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getSyllabiInstructor(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = [
		"s.syllabusId",
		"s.courseCode",
		"s.courseTitle",
		"s.semester",
		"s.enrollmentYear",
		"s.datePrepared",
	];

	try {
		// query for syllabi info
		const [syllabi] = await db.query(
			`
			SELECT ${columns.join(", ")}
			FROM syllabi s
			JOIN users u
				ON u.userId = s.userId 
			WHERE s.userId = ?
			ORDER BY datePrepared
			`,
			[targetId]
		);

		const payload = syllabi.map((syllabus) => ({
			syllabusId: syllabus.syllabusId,
			courseCode: syllabus.courseCode,
			courseTitle: syllabus.courseTitle,
			semester: syllabus.semester,
			enrollmentYear: syllabus.enrollmentYear,
			datePrepared: syllabus.datePrepared.toISOString().split("T")[0],
		}));

		// respond with success
		return res.status(200).json({
			payload,
			message: "Syllabi successfully found.",
		});
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
export async function getSyllabi(req, res) {
	// receive info from user
	const { programName } = req.query;

	if (!programName)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;

	if (role !== "Instructor" && role !== "Coordinator" && role !== "Admin")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = [
		"s.syllabusId",
		"s.courseCode",
		"s.courseTitle",
		"s.semester",
		"s.enrollmentYear",
		"s.datePrepared",
		"u.givenName",
		"u.middleName",
		"u.familyName",
		"u.suffix",
	];

	try {
		// query for syllabi info
		const [syllabi] = await db.query(
			`
			SELECT ${columns.join(", ")}
			FROM syllabi s
			JOIN users u
				ON u.userId = s.userId 
			WHERE s.programName = ?
			${role === "Coordinator" ? "AND evaluationStatus = 'Pending'" : ""}
			${role === "Admin" ? "AND evaluationStatus = 'Approved' AND approvalStatus = 'Pending'" : ""}
			ORDER BY s.datePrepared
			`,
			[programName]
		);

		const payload = syllabi.map((syllabus) => ({
			syllabusId: syllabus.syllabusId,
			courseCode: syllabus.courseCode,
			courseTitle: syllabus.courseTitle,
			semester: syllabus.semester,
			enrollmentYear: syllabus.enrollmentYear,
			datePrepared: syllabus.datePrepared.toISOString().split("T")[0],
			instructorName:
				syllabus.familyName +
				", " +
				syllabus.givenName +
				" " +
				syllabus.middleName +
				(syllabus.suffix !== null ? " " + syllabus.suffix : ""),
		}));

		// respond with success
		return res.status(200).json({
			payload,
			message: "Syllabi successfully found.",
		});
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getInstructorBasic(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// query for user info
		const [[user]] = await db.query(
			`
			SELECT givenName, middleName, familyName, suffix, department, role, profileImage
			FROM users
			WHERE userId = ?
			`,
			[targetId]
		);

		// format data for client
		const payload = {
			fullName:
				(user.givenName || "") +
				" " +
				(user.middleName || "") +
				" " +
				(user.familyName || "") +
				" " +
				(user.suffix !== null ? " " + user.suffix : ""),
			department: user.department,
			role: user.role,
			profileImage: user.profileImage,
		};

		// respond with success
		return res.status(200).json({ payload, message: "Instructor info found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getInstructorRecord(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// query for user info
		const [[user]] = await db.query(
			`
			SELECT givenName, middleName, familyName, suffix, profileImage
			FROM users
			WHERE userId = ?
			`,
			[targetId]
		);

		// get for student info
		const [[personnel]] = await db.query(
			`
			SELECT *
			FROM personnel
			WHERE userId = ?
			`,
			[targetId]
		);

		// format data for client
		const payload = {
			fullName:
				(user.familyName || "") +
				", " +
				(user.givenName || "") +
				" " +
				(user.middleName || "") +
				(user.suffix !== null ? " " + user.suffix : ""),
			givenName: user.givenName || "",
			middleName: user.middleName || "",
			familyName: user.familyName || "",
			suffix: user.suffix || "",
			sexAtBirth: personnel?.sexAtBirth,
			dateOfBirth: personnel?.dateOfBirth.toISOString().split("T")[0],
			civilStatus: personnel?.civilStatus,
			contactNum: personnel?.contactNum,
			religion: personnel?.religion,
			nationality: personnel?.nationality,
			addressLine1: personnel?.addressLine1,
			addressLine2: personnel?.addressLine2,
			city: personnel?.city,
			stateProvinceRegion: personnel?.stateProvinceRegion,
			postalCode: personnel?.postalCode,
			country: personnel?.country,
			disability: personnel?.disability,
			indigenousGroup: personnel?.indigenousGroup,
			numOfSiblings: personnel?.numOfSiblings,
			incomeBracket: personnel?.incomeBracket,
			academicStatus: personnel?.academicStatus,
			program: personnel?.program,
			profileImage: user.profileImage,
		};

		// respond with success
		return res.status(200).json({ payload, message: "Personnel info found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getAvailableCourses(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Advisor") return res.status(403).json({ error: "Forbidden: Access denied." });

	const columns = ["c.courseCode", "c.courseYear", "a.finalGrade"];
	const infoColumns = [
		"c.courseCode",
		"c.courseTitle",
		"c.creditUnitLec",
		"c.creditUnitLab",
		"c.contactHrsLec",
		"c.contactHrsLab",
		"c.prerequisite",
	];
	const infoCourseCodes = [];

	const outlierCourses = [
		{ code: "COSC 105", year: 4, prerequisites: ["MATH 4", "COSC 55", "DCIT 50"] },
		{ code: "COSC 106", year: 3, prerequisites: ["MATH 3", "COSC 101"] },
		{ code: "COSC 60", year: 2, prerequisites: ["COSC 50", "DCIT 23"] },
		{ code: "COSC 70", year: 2, prerequisites: ["DCIT 50", "DCIT 24"] },
	];

	try {
		const preferredProgram = await getPreferredProgram(targetId);

		// get semester
		const [[{ semester }]] = await db.query(
			`
			SELECT semester
			FROM enrollment_details
			WHERE programName = ?
			`,
			[preferredProgram]
		);

		// get available courses
		const [availableCourses] = await db.query(
			`
			SELECT ${columns.join(", ")}
			FROM courses c
			LEFT JOIN (
				SELECT ar.courseCode, 
					CASE
						WHEN ar.finalGrade IS NOT NULL THEN ar.finalGrade
						ELSE 'No Grade'
					END AS finalGrade
				FROM academic_records ar
				WHERE ar.userId = ?
			) a
				ON a.courseCode = c.courseCode
			WHERE (c.prerequisite IS NULL 
				OR c.prerequisite IN (
					SELECT ar.courseCode 
					FROM academic_records ar
					WHERE ar.userId = ?
			))
			AND c.courseSem = ?
			AND c.programName = ?
			`,
			[targetId, targetId, semester, preferredProgram]
		);

		for (const course of outlierCourses) {
			if (await getIsCourseAvailable(targetId, course.prerequisites))
				availableCourses.push({
					courseCode: course.code,
					courseYear: course.year,
					finalGrade: null,
				});
		}

		if (semester == 3)
			availableCourses.push({ courseCode: "COSC 199", courseYear: 98, finalGrade: null });
		if (semester == 2)
			availableCourses.push({ courseCode: "DCIT 60", courseYear: 99, finalGrade: null });
		if (semester == 1)
			availableCourses.push({ courseCode: "COSC 200A", courseYear: 100, finalGrade: null });

		const courseCodes = [];
		let lastYear = null;

		availableCourses
			.filter((record) => {
				const finalGrade = parseFloat(record.finalGrade);

				return (
					(isNaN(finalGrade) && record.finalGrade !== "S" && record.finalGrade !== "No Grade") ||
					finalGrade > 3 ||
					record.finalGrade === null
				);
			})
			.sort((a, b) => a.courseYear - b.courseYear)
			.forEach((course) => {
				infoCourseCodes.push(course.courseCode);

				if (course.courseYear === lastYear) return courseCodes.push(course.courseCode);

				lastYear = course.courseYear;

				if (course.courseYear === 98) {
					courseCodes.push(`Incoming Year 4`);
				} else if (course.courseYear === 99) {
					courseCodes.push(`Year 3 Standing`);
				} else if (course.courseYear === 100) {
					courseCodes.push(`Year 4 Standing`);
				} else {
					courseCodes.push(`Year ${lastYear}`);
				}

				courseCodes.push(course.courseCode);
			});

		// get course infos
		const [courseInfos] = await db.query(
			`
			SELECT ${infoColumns.join(", ")}
			FROM courses c
			WHERE c.courseCode IN (${infoCourseCodes.map((value) => `"${value}"`).join(", ")})
			`,
			[preferredProgram]
		);

		const payload = {
			courseCodes,
			courseInfos: courseInfos.map((course) => ({
				courseTitle: course.courseTitle,
				creditUnits: course.creditUnitLec + course.creditUnitLab,
				contactHrs: course.contactHrsLec + course.contactHrsLab,
				prerequisite: course.prerequisite,
				courseCode: course.courseCode,
			})),
		};

		// respond with success
		return res.status(200).json({ payload, message: "Available courses found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function getExamSchedules(req, res) {
	// receive info from user
	const { programName } = req.query;

	if (!programName)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	// check if user is admin
	const { role } = req.user;
	if (role !== "Admin") return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// get program details
		const [examSchedules] = await db.query(
			`
			SELECT *
			FROM exam_schedules
			WHERE programName = ?
			`,
			[programName]
		);

		if (examSchedules.length === 0)
			return res.status(404).json({ error: "Program exam schedules not found." });

		const payload = examSchedules.map((schedule) => ({
			...schedule,
			examDate: schedule.examDate.toISOString().split("T")[0],
		}));

		// respond with success
		return res.status(200).json({ payload, message: "Program exam schedules found." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
