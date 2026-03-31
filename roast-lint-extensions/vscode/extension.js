import * as vscode from 'vscode';
import { runLinter } from './linterRunner.js';
import { parseIssues } from './issueParser.js';
import { buildPrompt } from './promptBuilder.js';
import { sendToLLM } from './llmClient.js';

let outputChannel;

export function activate(context) {
    outputChannel = vscode.window.createOutputChannel("Roast Lint");

    let disposable = vscode.commands.registerCommand('roast-lint.roast', async function () {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Analyzing your code for roasts...",
            cancellable: false
        }, async (progress) => {
            try {
                // Read configuration
                const config = vscode.workspace.getConfiguration('roastLint');
                process.env.ROAST_LLM_URL = config.get('llmUrl');
                process.env.ROAST_LLM_MODEL = config.get('llmModel');
                process.env.ROAST_LLM_API_KEY = config.get('llmApiKey');

                const result = runLinter();
                if (!result) {
                    vscode.window.showErrorMessage('No supported linter found (Biome or ESLint).');
                    return;
                }

                const { linter, output } = result;
                const issues = parseIssues(linter, output);
                const mode = issues.length > 0 ? 'roast' : 'praise';

                const prompt = buildPrompt(mode, issues);
                const response = await sendToLLM(prompt);

                outputChannel.clear();
                outputChannel.appendLine(`--- ${linter.toUpperCase()} Results ---`);
                outputChannel.appendLine(`${issues.length} issue(s) found.\n`);
                outputChannel.appendLine(response);
                outputChannel.show();

                if (mode === 'roast') {
                  vscode.window.showWarningMessage('💀 Roast generated in Output channel!');
                } else {
                  vscode.window.showInformationMessage('😏 Praise generated in Output channel!');
                }

            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
                outputChannel.appendLine(`ERROR: ${error.message}`);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
