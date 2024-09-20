import axios from "axios";
import { difficultyColor, color } from "./colors.js";

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

export const fetchCategory = async () => {
  try {
    const ret = await axios.post(baseUrl, {
      query: query,
      variables: { slug: "top-interview-150" },
    });

    return ret.data.data.studyPlanV2Detail.planSubGroups;
  } catch (error) {}
};

export const fetchQuestion = async (titleSlug) => {
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

export const SCategory = async () => {
  console.clear();
  const categories = await fetchCategory();

  categories.forEach((val, idx) => {
    console.log(`${color.cyan}(${idx})${color.reset} `, val.name);
  });

  return categories;
};

export const SQuestion = async (categories, categoryIdx, rl) => {
  let questionIdx;
  while (
    isNaN(questionIdx) || // Check if the input is not a number
    ((questionIdx < 0 ||
      questionIdx >= categories[categoryIdx].questions.length) &&
      questionIdx !== "q") // Allow "q" to be a valid input to quit
  ) {
    console.clear();
    categories[categoryIdx].questions.forEach((question, idx) => {
      const titlePadded = question.title.padEnd(60, " ");
      console.log(
        `${color.cyan}(${idx})${color.reset} ${titlePadded}${
          difficultyColor[question.difficulty]
        }${question.difficulty.padEnd(6, " ")}${color.reset}`
      );
    });
    questionIdx = await rl.question("Enter question: ");

    if (questionIdx !== "q") {
      questionIdx = parseInt(questionIdx, 10);
    }
  }

  return questionIdx;
};

export function decodeHtml(html) {
  const text = html.replace(/<\/?[^>]+(>|$)/g, "");
  const entities = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
  };

  return text
    .replace(/^\s*$(?:\r\n?|\n)/gm, "")
    .replace(/&[a-z]+;/g, (match) => entities[match] || match)
    .replace(/Example/g, `${color.yellow}Example${color.reset}`)
    .replace(/Constraints/g, `${color.yellow}Constraints${color.reset}`);
}
