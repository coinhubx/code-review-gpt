import { askAI } from "../../review/llm/askAI";
import { constructPromptsArray } from "../../review/prompt/constructPrompt";
import { TestCase } from "../types";

const runTest = async (testCase: TestCase, modelName: string) => {
  if (!testCase.snippet) {
    throw new Error(`Test case ${testCase.name} does not have a snippet.`);
  }
  // First step: run the review on the code snippet.
  const prompts = await constructPromptsArray([testCase.snippet]);
  const reviewResponse = await askAI(prompts, modelName);
};

export const runTests = async (testCases: TestCase[], modelName: string) => {
  await Promise.all(testCases.map((testCase) => runTest(testCase, modelName)));
};
