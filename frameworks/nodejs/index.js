const http = require("http");
const mysql = require("mysql2/promise");
const { parse } = require("url");
const { createConnection } = mysql;

const PORT = 80;

let ready = false;
let conn = null;

// Connect to the MySQL database
createConnection({
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

const server = http.createServer((req, res) => {
	const { url, method } = req;
	const { pathname } = parse(url, true);

	if (pathname === "/") {
		if (!ready) {
			res.writeHead(503, { "Content-Type": "text/plain" });
			res.end("Not ready");
		} else {
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("Ready");
		}
	} else if (pathname === "/db" && method === "GET") {
		if (!ready) {
			res.writeHead(503, { "Content-Type": "text/plain" });
			res.end("Not ready");
		} else {
			conn.query("SELECT * FROM customers").then(([rows]) => {
				res.writeHead(200, { "Content-Type": "application/json" });
				res.end(JSON.stringify(rows));
			});
		}
	} else if (pathname === "/info" && method === "GET") {
		const info = {
			version: process.version,
		};
		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify(info));
	} else {
		res.writeHead(404, { "Content-Type": "text/plain" });
		res.end("Not Found");
	}
});

server.listen(PORT, () => {
	console.log(`App listening on port ${PORT}!`);
});
