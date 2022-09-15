import axios from "axios";
import classificator from "classificator";
import * as fs from "fs";
import keyword_extractor from "keyword-extractor";
import { Node, Result } from "./node";
import { State } from "./state";

export class Classifier {
	private model: classificator.NaiveBayes;
	private readonly urls: string[] = [];

	constructor(fileName?: string) {
		if (fileName) {
			let fileContent = fs.readFileSync(fileName).toString();
			let state = JSON.parse(fileContent) as State;
			this.model = classificator.fromJson(state.model);
			this.urls = state.urls;
		} else {
			this.model = classificator();
		}
	}

	learn(str: string, type: string) {
		this.model.learn(str, type);
	}

	predict(str: string): Result {
		let categories = this.model.categorize(str);
		let nodes: Node[] = [];
		let predictedConfidence: number = 0;
		categories.likelihoods.sort((item) => item.proba);
		categories.likelihoods.forEach((likelihood) => {
			if (likelihood.category == categories.predictedCategory) predictedConfidence = likelihood.proba;
			nodes.push({
				confidence: likelihood.proba,
				type: likelihood.category,
			});
		});
		return {
			nodes: nodes,
			predictedType: categories.predictedCategory,
			predictionConfidence: predictedConfidence,
		};
	}

	exportToFile(fileName: string) {
		let modelStr = this.model.toJson();
		let state: State = { model: modelStr, urls: this.urls };
		let str = JSON.stringify(state);
		fs.writeFileSync(fileName, str);
	}

	async learnWebsite(url: string, type: string): Promise<boolean> {
		if (this.urls.includes(url)) return false;
		this.urls.push(url);
		this.learn(await this.getWebsiteData(url), type);
		return true;
	}

	async predictWebsite(url: string): Promise<Result> {
		return this.predict(await this.getWebsiteData(url));
	}

	async getWebsiteData(url: string): Promise<string> {
		let page = await axios.get(url, { transformResponse: [] });
		let data = keyword_extractor.extract(page.data);
		return data.join(" ");
	}
}
