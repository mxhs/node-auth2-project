const express = require("express");

const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const server = express();
server.use(express.json());

// server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
	res.json({ api: "up" });
});

server.use((err, req, res) => {
	res.status(500).json({ message: err.message, stack: err.stack });
});

module.exports = server;
