/**
 * Builds the prompt to be sent to the LLM.
 * @param {string} mode - 'roast' or 'praise'.
 * @param {string[]} issues - List of issues.
 * @param {number} insultLevel - 3 as requested.
 * @returns {string} The final prompt string.
 */
export function buildPrompt(mode, issues, insultLevel = 3) {
  const systemPrompt = `You are a witty senior software engineer.

Modes:
1. Roast Mode (if issues exist)
2. Praise Mode (if code is clean)

Rules:
- Be funny, sarcastic, or charming
- No hate speech or offensive content
- Keep under 120 words
- Always include useful feedback`;

  let userPrompt = `Mode: ${mode}\n`;
  if (mode === 'roast') {
    userPrompt += `Insult level: ${insultLevel}\n`;
    userPrompt += `Issues list:\n${issues.map(i => `- ${i}`).join('\n')}\n\n`;
    userPrompt += `ROAST MODE\n- Roast the developer's mistakes\n- Use sarcasm and humor\n- Slightly harsh but funny\n- Include 1 helpful fix\n\nFormat:\n💀 Roast:\n<text>\n\n🛠 Advice:\n<text>`;
  } else {
    userPrompt += `Mode: praise\nNo issues found.\n\nPRAISE MODE\n- Praise the developer's code\n- Can be playful, flirty, or admiring\n- Make it fun but not cringe\n- Still include 1 improvement tip\n\nFormat:\n😏 Smooth Talk:\n<text>\n\n✨ Suggestion:\n<text>`;
  }

  return `${systemPrompt}\n\nUSER INPUT:\n${userPrompt}`;
}
