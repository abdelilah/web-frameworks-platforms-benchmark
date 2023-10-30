const express = require("express");
const mysql = require("mysql2/promise");
const packagejson = require("./package.json");

const app = express();
const PORT = 80;

let ready = false;

// Connect to DB Server
let conn = null;
mysql
	.createConnection({
		host: "host.docker.internal",
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_ROOT_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		port: process.env.MYSQL_PORT,
	})
	.then((connection) => {
		conn = connection;
		ready = true;
		console.log("Connected to MySQL Server");
	})
	.catch((err) => {
		console.error("Error connecting to MySQL Server");
		console.error(err);
		process.exit(1);
	});

app.get("/", (_, res) => {
	if (!ready) {
		res.status(503).send("Not ready");
		return;
	}

	res.send("Ready");
});

app.get("/db", (_, res) => {
	// Retrieve data from 'customers' table
	conn.query("SELECT * FROM customers").then(([rows]) => {
		res.json(rows);
	});
});

app.get("/info", (_, res) => {
	// Find express package version
	const version = packagejson.dependencies.express.replace("^", "");

	res.json({
		version,
	});
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
