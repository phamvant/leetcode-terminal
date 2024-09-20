import axios from "axios";
import readline from "readline/promises";

const black = "\x1b[30m";
const red = "\x1b[31m";
const green = "\x1b[32m";
const yellow = "\x1b[33m";
const blue = "\x1b[34m";
const magenta = "\x1b[35m";
const cyan = "\x1b[36m";
const white = "\x1b[37m";

const reset = "\x1b[0m";

const difficultyColor = {
  EASY: green,
  MEDIUM: yellow,
  HARD: red,
};

const titleColumnWidth = 60;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const baseUrl = "https://leetcode.com/graphql/";

const query = `
  query studyPlanDetail($slug: String!) {
    studyPlanV2Detail(planSlug: $slug) {
      planSubGroups {
        slug
        name
        questions {
          titleSlug
          title
          difficulty
          status
        }
      }
    }
  }
`;

const questionQuery = `
  query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
      mysqlSchemas
      dataSchemas
    }
  }
`;

let category;

const fetchCategory = async () => {
  try {
    const ret = await axios.post(baseUrl, {
      query: query,
      variables: { slug: "top-interview-150" },
    });

    category = ret.data.data;
  } catch (error) {}
};

const fetchQuestion = async (titleSlug) => {
  try {
    const ret = await axios.post(baseUrl, {
      query: questionQuery,
      variables: { titleSlug: titleSlug },
    });

    return ret.data.data.question.content;
  } catch (error) {
    // console.log(error);
  }
};

const keymap = {
  SCategory: {
    Q: "exit",
  },
  SQuestion: {
    Q: "exit",
    R: "back",
  },
};

function decodeHtml(html) {
  const text = html.replace(/<\/?[^>]+(>|$)/g, "");
  const entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    // Add more entities if needed
  };

  // Replace HTML entities
  return text
    .replace(/^\s*$(?:\r\n?|\n)/gm, "")
    .replace(/&[a-z]+;/g, (match) => entities[match] || match)
    .replace(/Example/g, `${yellow}Example${reset}`)
    .replace(/Constraints/g, `${yellow}Constraints${reset}`);
}

const main = async () => {
  console.clear();
  await fetchCategory();

  category.studyPlanV2Detail.planSubGroups.forEach((val, idx) => {
    console.log(`${cyan}(${idx})${reset} `, val.name);
  });

  const categoryIdx = await rl.question("Choose category: ");
  console.clear();

  category.studyPlanV2Detail.planSubGroups[categoryIdx].questions.forEach(
    (question, idx) => {
      const titlePadded = question.title.padEnd(titleColumnWidth, " ");
      console.log(
        `${cyan}(${idx})${reset} ${titlePadded}${
          difficultyColor[question.difficulty]
        }${question.difficulty.padEnd(6, " ")}${reset}`
      );
    }
  );

  const questionIdx = await rl.question("Enter question: ");
  const question =
    category.studyPlanV2Detail.planSubGroups[categoryIdx].questions[
      questionIdx
    ];

  const questionContent = await fetchQuestion(question.titleSlug);
  console.log(decodeHtml(questionContent));
};

main();
