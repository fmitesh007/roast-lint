/**
 * Sends the prompt to the configured LLM API.
 * Supports Ollama (default) or OpenAI-compatible APIs via env vars.
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string>} The LLM's response text.
 */
export async function sendToLLM(prompt) {
  const url = process.env.ROAST_LLM_URL || 'http://localhost:11434/api/generate';
  const model = process.env.ROAST_LLM_MODEL || 'llama3';
  const apiKey = process.env.ROAST_LLM_API_KEY || '';

  const isOllamaGenerate = url.endsWith('/api/generate');

  try {
    const body = isOllamaGenerate 
      ? { model, prompt, stream: false }
      : {
          model,
          messages: [{ role: 'user', content: prompt }],
          stream: false
        };

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle Ollama /api/generate vs OpenAI /v1/chat/completions
    if (isOllamaGenerate) return data.response;
    if (data.choices && data.choices[0]?.message?.content) return data.choices[0].message.content;
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    throw new Error('💀 Even AI refused to review this mess. (Check your LLM config)');
  }
}
