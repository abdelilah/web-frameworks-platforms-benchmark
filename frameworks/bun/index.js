const mysql = require("mysql2/promise");

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

Bun.serve({
	port: 80,
	async fetch(request) {
		const pathname = new URL(request.url).pathname;

		// Handle /
		if (pathname === "/") {
			if (!ready) {
				return new Response("Not ready", {
					status: 503,
				});
			}
			return new Response("Ready");
		}

		// /info endpoint
		if (pathname === "/info" && request.method === "GET") {
			const info = {
				version: Bun.version,
			};
			return new Response(JSON.stringify(info));
		}

		// /db endpoint
		if (pathname === "/db" && request.method === "GET") {
			const [rows] = await conn.query("SELECT * FROM customers");
			return new Response(JSON.stringify(rows));
		}

		// Otherwise 404
		return new Response("Not Found", {
			status: 404,
		});
	},
});
