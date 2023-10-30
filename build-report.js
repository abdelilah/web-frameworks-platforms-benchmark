const fs = require("fs");
const path = require("path");

const reportsFolder = "/results";
const reportTemplate = "/report-template.html";

const main = async () => {
	console.log("Generating report...");

	const results = [];

	// List folders in reportsFolder
	const frameworks = fs.readdirSync(reportsFolder).filter((file) => {
		const filePath = path.join(reportsFolder, file);
		const isDirectory = fs.lstatSync(filePath).isDirectory();
		return isDirectory;
	});

	// Loop over folders
	for (const framework of frameworks) {
		let result = {
			framework,
			version: undefined,
			reports: [],
		};

		// Read info file
		const infoFile = path.join(reportsFolder, framework, "info.json");
		const info = JSON.parse(fs.readFileSync(infoFile));
		result.version = info.version;

		// Read db file
		const dbFile = path.join(reportsFolder, framework, "db.json");
		const db = JSON.parse(fs.readFileSync(dbFile));
		result.reports.push(db);

		results.push(result);
	}

	// Read report template
	let reportTemplateContent = fs.readFileSync(reportTemplate, "utf8");

	// Replace placeholders
	reportTemplateContent = reportTemplateContent.replace(
		/\_\_DATA\_\_/g,
		JSON.stringify(results, null, 4)
	);

	// Write report
	const reportFile = path.join(reportsFolder, "report.html");
	fs.writeFileSync(reportFile, reportTemplateContent);

	console.log("Report generated.");
};

main();
