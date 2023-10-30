const fs = require("fs");

const RUN_COUNT = 100;
const urlBase = `http://host.docker.internal:${process.env.WEB_PORT}`;
const reportPath = "/results";

const main = async () => {
	// Get infos
	console.log("Getting infos...");

	const info = await fetch(`${urlBase}/info`).then((res) => res.json());
	fs.writeFileSync(`${reportPath}/info.json`, JSON.stringify(info, null, 2));

	const result = {
		max: 0,
		min: Infinity,
		avg: 0,
		total: 0,
	};

	// Get sample
	console.log("Getting sample...");
	const sample = await fetch(`${urlBase}/db`).then((res) => res.json());
	fs.writeFileSync(
		`${reportPath}/sample.json`,
		JSON.stringify(sample, null, 2)
	);

	// Run benchmark
	process.stdout.write("Running benchmark");
	for (let i = 0; i < RUN_COUNT; i++) {
		process.stdout.write(".");

		const start = Date.now();
		let end = 0;
		const res = await fetch(`${urlBase}/db`).then((res) => {
			end = Date.now();
			return res.json();
		});

		const diff = end - start;
		result.max = Math.max(result.max, diff);
		result.min = Math.min(result.min, diff);
		result.total += diff;
	}
	process.stdout.write("\n");

	result.avg = (result.max + result.min) / 2;

	fs.writeFileSync(`${reportPath}/db.json`, JSON.stringify(result, null, 2));
};

main();
