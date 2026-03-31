#!/usr/bin/env node
import { runLinter } from './linterRunner.js';
import { parseIssues } from './issueParser.js';
import { buildPrompt } from './promptBuilder.js';
import { sendToLLM } from './llmClient.js';

async function main() {
  const result = runLinter();

  if (!result) {
    console.log('No supported linter found. Install Biome or ESLint.');
    return;
  }

  const { linter, output } = result;
  const issues = parseIssues(linter, output);

  let mode = issues.length > 0 ? 'roast' : 'praise';

  if (mode === 'roast') {
    console.log(`⚠️  ${issues.length} issue(s) found using ${linter}\n`);
  } else {
    console.log(`✅ Clean code detected using ${linter}\n`);
  }

  const prompt = buildPrompt(mode, issues);

  try {
    const response = await sendToLLM(prompt);
    console.log(response);
  } catch (error) {
    console.error(error.message);
  }
}

main();
