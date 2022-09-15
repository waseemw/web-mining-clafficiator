import * as fs from "fs";
import { Classifier } from "./classifier/classifier";

export async function saveModel() {
	const classifier = new Classifier();
	const file = fs.readFileSync("websites.csv").toString().split("\n");
	file.shift();

	for (const line of file) {
		if (!line || line.length < 3) continue;
		const [type, url] = line.split(",");
		console.log(`Training   ${type.padEnd(20)} ${url}`);
		await classifier.learnWebsite(url, type);
	}
	classifier.exportToFile("model.ml");
}

saveModel();
