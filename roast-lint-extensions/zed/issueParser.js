/**
 * Normalizes different linter output formats into a standard issues array.
 * @param {string} linter - The linter name ('biome' or 'eslint').
 * @param {string} rawOutput - The raw linter output string.
 * @returns {string[]} An array of strings describing the linting issues.
 */
export function parseIssues(linter, rawOutput) {
  if (!rawOutput) return [];
  
  try {
    const data = JSON.parse(rawOutput);
    const issues = [];

    if (linter === 'biome') {
      // Biome JSON structure: { diagnostics: [ { message: "...", file: { name: "..." } } ] }
      if (data.diagnostics && Array.isArray(data.diagnostics)) {
        for (const diagnostic of data.diagnostics) {
          const file = diagnostic.file?.name || 'unknown file';
          const message = diagnostic.message || 'no message';
          issues.push(`${message} in ${file}`);
        }
      }
    } else if (linter === 'eslint') {
      // ESLint JSON structure: [ { filePath: "...", messages: [ { message: "..." } ] } ]
      if (Array.isArray(data)) {
        for (const fileResult of data) {
          const file = fileResult.filePath;
          for (const msg of fileResult.messages) {
            issues.push(`${msg.message} in ${file}`);
          }
        }
      }
    }
    return issues;
  } catch (error) {
    console.error('Failed to parse linter output:', error.message);
    return [];
  }
}
