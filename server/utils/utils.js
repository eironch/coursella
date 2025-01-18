import db from "../config/db.js";

export async function getApplicationId(targetId) {
	// get application id
	const [[{ applicationId }]] = await db.query(
		`
		SELECT applicationId
		FROM students
		WHERE userId = ?
		`,
		[targetId]
	);

	return applicationId;
}

export async function getPreferredProgram(targetId) {
	const applicationId = await getApplicationId(targetId);

	// get preferred program
	const [[{ preferredProgram }]] = await db.query(
		`
		SELECT preferredProgram
		FROM applications
		WHERE applicationId = ?
		`,
		[applicationId]
	);

	return preferredProgram;
}

export async function getIsCourseAvailable(targetId, prerequisites) {
	const [course] = await db.query(
		`
		SELECT finalGrade
		FROM academic_records 
		WHERE courseCode IN (${prerequisites.map((value) => `"${value}"`).join(", ")})
		AND userID = ?
		`,
		[targetId]
	);

	return course.some((record) => parseFloat(record.finalGrade) <= 3);
}
