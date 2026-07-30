/**
 * AI provider abstraction for GhostTyper
 * All calls run in the MV3 service worker (background.js), never in content scripts.
 */

const PROVIDERS = {
  pollinations: {
    name: "Pollinations (Free, no key)",
    baseUrl: "https://text.pollinations.ai/openai",
    defaultModel: "openai",
    requiresKey: false,
  },
  groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    requiresKey: true,
  },
  cerebras: {
    name: "Cerebras",
    baseUrl: "https://api.cerebras.ai/v1",
    defaultModel: "llama-3.3-70b",
    requiresKey: true,
  },
  gemini: {
    name: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultModel: "gemini-2.0-flash",
    requiresKey: true,
  },
  openrouter: {
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "deepseek/deepseek-r1:free",
    requiresKey: true,
  },
  mistral: {
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    requiresKey: true,
  },
  custom: {
    name: "Custom (OpenAI-compatible)",
    baseUrl: "",
    defaultModel: "gpt-3.5-turbo",
    requiresKey: false,
  },
};

/** Short-completion prompt. Returns only the continuation text, not the original. */
function buildRequest(context, model) {
  return {
    model,
    messages: [
      {
        role: "system",
        content:
          "You are an inline writing assistant. Complete the user's sentence or phrase naturally. " +
          "Return ONLY the completion text (what comes after the cursor), not the original text. " +
          "Keep it concise: 1 sentence max. No explanations, no prefixes.",
      },
      { role: "user", content: context },
    ],
    max_tokens: 64,
    temperature: 0,
    stream: false,
  };
}

async function callOpenAICompat(baseUrl, apiKey, body) {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Provider ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? "").trim();
}

/**
 * Fetch a ghost-text completion for the given context.
 * @param {string} context - text before cursor (the prefix)
 * @param {object} settings - extension settings
 * @returns {Promise<string>}
 */
async function getCompletion(context, settings) {
  const providerId = settings.provider || "pollinations";
  const provider = PROVIDERS[providerId];
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  const baseUrl =
    providerId === "custom"
      ? (settings.customBaseUrl || "").trim()
      : provider.baseUrl;
  if (!baseUrl) throw new Error("Custom provider base URL not set.");

  const apiKey = settings.apiKey || null;
  const model = (settings.model || "").trim() || provider.defaultModel;

  return callOpenAICompat(baseUrl, apiKey, buildRequest(context, model));
}

export { PROVIDERS, getCompletion };
