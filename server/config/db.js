import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const db = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	ssl: {
		ca: fs.readFileSync(process.env.DB_CA)
	},
	timezone: '+00:00',
  waitForConnections: true,
  connectionLimit: 40,
  queueLimit: 0,
});

export default db;
