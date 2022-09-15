import {Classifier} from "./classifier/classifier";

async function test() {
    let url = process.argv[2];
    if (!url)
        return console.error("No URL found");
    console.log(`Predicting ${url}`);
    const classifier = new Classifier("model.ml");
    const predictions = await classifier.predictWebsite(url);
    console.log(predictions);
}

test();
