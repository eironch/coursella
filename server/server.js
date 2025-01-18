import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import createRoutes from "./routes/createRoutes.js";

dotenv.config();

const server = express();

server.use(cookieParser());
server.use(express.json());
server.use(
	cors({
		origin:
			process.env.ENV !== "production" ? "http://localhost:5173" : "https://coursella.vercel.app",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);

server.get("/", (_, res) => {
	res.json("good mourning.");
});

server.use("/api/auth", authRoutes);
server.use("/api/user", userRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/action", actionRoutes);
server.use("/api/create", createRoutes);

server.listen(8080, () => {
	console.log("Connected to the server.");
});
