import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import db from "../config/db.js";

dotenv.config();

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

async function checkIfUserExists(userId, res) {
	const [user] = await db.query(
		`
			SELECT 1
			FROM users
			WHERE userId = ?
			`,
		[userId] // value
	);

	// respond with error
	if (user.length === 0) return res.status(401).json({ error: "Invalid token credentials." });
}

function getNewAccessToken(req, res, next) {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) return res.status(401).json({ error: "Unauthorized: No token provided." });

	try {
		const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

		const newAccessToken = jwt.sign(
			{ userId: decodedRefreshToken.userId, role: decodedRefreshToken.role },
			ACCESS_TOKEN_SECRET,
			{
				expiresIn: "1h",
			}
		);

		res.setHeader("Authorization", `Bearer ${newAccessToken}`);

		res.json({ accessToken: newAccessToken });

		req.user = decodedRefreshToken;
		
		checkIfUserExists(req.user.userId, res)
	} catch (err) {
		return res.status(403).json({ error: "Forbidden: Invalid or expired token." });
	}
}

export default function authMiddleware(req, res, next) {
	const accessToken = req.headers.authorization?.split(" ")[1];
	if (!accessToken) return res.status(401).json({ error: "Unauthorized: No token provided." });

	try {
		const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

		req.user = decodedAccessToken;

		checkIfUserExists(req.user.userId)

		next();
	} catch (err) {
		if (err.name !== "TokenExpiredError")
			return res.status(403).json({ error: "Forbidden: Invalid or expired token." });

		return getNewAccessToken(req, res, next);
	}
}
