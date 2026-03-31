# roast-lint

A CLI tool that roasts or praises your code based on lint results.

## Prerequisites

- **Node.js**: Version 18+ (uses native `fetch`).
- **Ollama**: Must be running locally.
  - Install from: [ollama.com](https://ollama.com/)
  - Pull the model: `ollama pull llama3`
- **Linter**: Biome or ESLint should be installed in your project or globally.

## Installation

```bash
# Clone the repository
cd roast-lint
npm link
```

## Setup Linters

### Biome
```bash
npm install --save-dev --save-exact @biomejs/biome
npx biome init
```

### ESLint
```bash
npm install --save-dev eslint
npx eslint --init
```

## Usage

Run it in your project root:

```bash
npx roast-lint
```

## Configuration

By default, it uses **Ollama** (`llama3`) at `http://localhost:11434`. You can configure it to use any LLM by setting environment variables:

### Using Ollama (Custom Model)
```bash
export ROAST_LLM_MODEL="mistral"
npx roast-lint
```

### Using OpenAI
```bash
export ROAST_LLM_URL="https://api.openai.com/v1/chat/completions"
export ROAST_LLM_MODEL="gpt-4o"
export ROAST_LLM_API_KEY="sk-..."
npx roast-lint
```

### Supported Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `ROAST_LLM_URL` | The API endpoint | `http://localhost:11434/api/generate` |
| `ROAST_LLM_MODEL` | The model name | `llama3` |
| `ROAST_LLM_API_KEY` | Your API key (if needed) | `(empty)` |

*Note: If `ROAST_LLM_URL` ends with `/api/generate`, the tool assumes an Ollama-style payload. Otherwise, it uses an OpenAI-compatible messages payload.*

## How it works

1.  **Detects Linter**: Checks for `biome` or `eslint`.
2.  **Runs Linter**: Executes the linter with JSON output.
3.  **Parses Issues**: Extracts error messages and file paths.
4.  **Generates Prompt**: Decides between **Roast Mode** (if issues found) or **Praise Mode** (if clean).
5.  **LLM Interaction**: Sends the prompt to a local Ollama instance (`llama3` model).
6.  **Outputs**: Displays a witty response from a senior engineer.

## Project Structure

- `index.js`: CLI entry point.
- `linterRunner.js`: Detects and runs the appropriate linter.
- `issueParser.js`: Normalizes JSON output from linters.
- `llmClient.js`: Handles API calls to Ollama.
- `promptBuilder.js`: Constructs the system and user prompts.
- `utils.js`: Helper functions for shell commands.
