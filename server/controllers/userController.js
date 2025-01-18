import db from "../config/db.js";

export async function getSyllabus(req, res) {
	// receive info from user
	const { targetId } = req.query;

	if (!targetId)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

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
			AND evaluationStatus = "Approved"
			AND approvalStatus = "Approved"
			`,
			[targetId]
		);

		if (!syllabus)
			return res
				.status(403)
				.json({ error: "Invalid request, syllabus not approved or does not exist." });

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
