import * as fs from "fs";
import { Classifier } from "./classifier/classifier";

export async function resaveModel() {
	const classifier = new Classifier("model.ml");
	const file = fs.readFileSync("websites.csv").toString().split("\n");
	file.shift();

	for (const line of file) {
		if (!line || line.length < 3) continue;
		const [type, url] = line.split(",");
		const trained = await classifier.learnWebsite(url, type);
		let word = trained ? "Trained" : "Skipped";
		word = word.padEnd(10);
		console.log(`${word} ${type.padEnd(20)} ${url}`);
	}
	classifier.exportToFile("model.ml");
}

resaveModel();
