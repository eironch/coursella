import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pemPath = path.resolve(__dirname, "../cert/isrgrootx1.pem");

dotenv.config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	ssl: {
		ca: fs.readFileSync(pemPath),
	},
	timezone: "+00:00",
	waitForConnections: true,
	connectionLimit: 40,
	queueLimit: 0,
});

export default db;
