import db from "../config/db.js";


export async function putApprovalStatus(req, res) {
	// recieve info from user
	const { targetId, status } = req.body;

	if (!targetId || !status)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is admin
	if (role !== "Admin") return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// update evaluation status
		await db.query(
			`
			UPDATE syllabi 
			SET approvalStatus = ?, dateApproved = NOW()
			WHERE syllabusId = ?
			`,
			[status, targetId]
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully conducted syllabus approval." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function putEvaluationStatus(req, res) {
	// recieve info from user
	const { targetId, status } = req.body;

	if (!targetId || !status)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });

	const { role } = req.user;

	// check if user is coordinator
	if (role !== "Coordinator") return res.status(403).json({ error: "Forbidden: Access denied." });

	try {
		// update evaluation status
		await db.query(
			`
			UPDATE syllabi 
			SET evaluationStatus = ?, dateEvaluated = NOW()
			WHERE syllabusId = ?
			`,
			[status, targetId]
		);

		// respond with success
		return res
			.status(200)
			.json({ message: "You have successfully conducted syllabus evaluation." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}

export async function putInstructorRecord(req, res) {
	// recieve info from user
	const { targetId } = req.body;

	const formData = JSON.parse(req.body.record);

	if (!targetId || !formData)
		return res.status(401).json({ error: "Invalid request, complete credentials required." });
	const { role } = req.user;

	// check if user is instructor
	if (role !== "Instructor" && role !== "Coordinator")
		return res.status(403).json({ error: "Forbidden: Access denied." });

	// format data
	const userColumns = ["givenName", "middleName", "familyName", "suffix"];
	const userValues = [
		formData.givenName,
		formData.middleName,
		formData.familyName,
		formData.suffix,
	];

	const personnelColumns = [
		"sexAtBirth",
		"dateOfBirth",
		"civilStatus",
		"contactNum",
		"religion",
		"nationality",
		"addressLine1",
		"addressLine2",
		"city",
		"stateProvinceRegion",
		"postalCode",
		"country",
		"disability",
		"indigenousGroup",
	];
	const personnelValues = [
		formData.sexAtBirth,
		formData.dateOfBirth,
		formData.civilStatus,
		formData.contactNum,
		formData.religion,
		formData.nationality,
		formData.addressLine1,
		formData.addressLine2,
		formData.city,
		formData.stateProvinceRegion,
		formData.postalCode,
		formData.country,
		formData.disability,
		formData.indigenousGroup,
	];

	if (req.file) {
		userColumns.push("profileImage");
		userValues.push(req.file.buffer);
	}
	try {
		// insert into users
		await db.query(
			`
			UPDATE users 
			SET ${userColumns.map((columnName) => columnName + "= ?").join(", ")}
			WHERE userId = ?
			`,
			[...userValues, targetId]
		);

		// upsert into personnel
		await db.query(
			`
			INSERT INTO personnel (${personnelColumns.join(", ")}, userId)
			VALUES (${personnelColumns.map(() => "?").join(", ")}, ?)
			ON DUPLICATE KEY UPDATE
			${personnelColumns
				.map((columnName, index) =>
					personnelValues[index] ? `${columnName} = VALUES(${columnName})` : null
				)
				.filter(Boolean)
				.join(", ")}
			`,
			[...personnelValues, targetId]
		);

		// respond with success
		return res.status(200).json({ message: "You have successfully updated your info." });
	} catch (err) {
		// respond with error
		console.error(err);
		return res.status(500).json({ error: "Internal server error." });
	}
}
