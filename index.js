import readline from "readline/promises";
import { fetchQuestion, SCategory, SQuestion } from "./fetching.js";
import { decodeHtml } from "./fetching.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const loop = async () => {
  let categoryIdx;
  let categories;
  while (true) {
    if (categoryIdx == undefined) {
      categories = await SCategory();
      categoryIdx = await rl.question("Choose category: ");
    }

    const questionIdx = await SQuestion(categories, categoryIdx, rl);

    const question = categories[categoryIdx].questions[questionIdx];

    const questionContent = await fetchQuestion(question.titleSlug);

    console.clear();
    console.log(decodeHtml(questionContent));

    let input;

    while (input !== "q" && input !== "b") {
      input = await rl.question("type 'q' to quit, 'b' to back: ");
      console.log(input);
    }

    if (input === "q") {
      categoryIdx = undefined;
    }
  }
};

loop();
