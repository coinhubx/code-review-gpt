import path from "path";
import { loadTestCases } from "./load/loadTestCases";
import AIModel from "../review/llm/AIModel";
import { openAIApiKey } from "../config";
import { loadOrGenerateCodeSnippets } from "./load/loadTestCodeSnippets";
import { runTests } from "./run/runTest";

interface ReviewArgs {
  [x: string]: unknown;
  ci: boolean;
  _: (string | number)[];
  $0: string;
}

export const test = async (yargs: ReviewArgs) => {
  // Run the review on code examples
  // Compare the results to the expected results

  const modelName = yargs.model as string;

  // Fetch the test cases.
  const testCases = loadTestCases(path.join(__dirname, "cases"));

  // Load the code snippets for the test cases. Generate them if they don't exist or are outdated.
  const testCasesWithSnippets = await loadOrGenerateCodeSnippets(
    testCases,
    path.join(__dirname, "cases/.cache"),
    new AIModel({
      modelName: modelName,
      temperature: 0.0,
      apiKey: openAIApiKey(),
    })
  );

  // // Run the review on the code snippets and compare the results to the expected results.
  await runTests(testCasesWithSnippets, modelName);
};
