export interface Node {
	type: string;
	confidence: number;
}

export interface Result {
	predictedType: string;
	predictionConfidence: number;
	nodes: Node[];
}
