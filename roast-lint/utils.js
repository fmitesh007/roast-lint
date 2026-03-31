import { execSync } from 'node:child_process';

/**
 * Checks if a command is available in the current environment.
 * @param {string} command - The command to check.
 * @returns {boolean} True if the command exists, false otherwise.
 */
export function commandExists(command) {
  try {
    const checkCmd = process.platform === 'win32' ? `where ${command}` : `command -v ${command}`;
    execSync(checkCmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Executes a shell command and returns the output as a string.
 * @param {string} command - The command to execute.
 * @returns {string} The command output.
 */
export function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (error) {
    // Some linters exit with a non-zero code when issues are found.
    // We want the output anyway.
    return error.stdout || '';
  }
}
