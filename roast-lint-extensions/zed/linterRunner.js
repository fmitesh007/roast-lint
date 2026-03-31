import { commandExists, runCommand } from './utils.js';

/**
 * Runs the first available linter and returns its raw output.
 * @returns {object|null} { linter, output } or null if none found.
 */
export function runLinter() {
  if (commandExists('biome')) {
    return { linter: 'biome', output: runCommand('biome check . --reporter json') };
  }
  if (commandExists('eslint')) {
    return { linter: 'eslint', output: runCommand('eslint . -f json') };
  }
  return null;
}
