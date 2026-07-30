/**
 * Popup script for GhostTyper
 */

const statusDot = document.querySelector(".status-dot");
const statusText = document.querySelector(".status-text");
const providerInfo = document.querySelector(".provider-info");
const apiKeyIndicator = document.querySelector(".api-key-indicator");
const apiKeyText = document.querySelector(".api-key-text");

const PROVIDER_LABELS = {
  pollinations: "Pollinations (free)",
  groq: "Groq",
  cerebras: "Cerebras",
  gemini: "Google Gemini",
  openrouter: "OpenRouter",
  mistral: "Mistral",
  custom: "Custom",
};

async function initialize() {
  const settings = await chrome.storage.local.get([
    "isEnabled",
    "provider",
    "apiKey",
  ]);

  const enabled = settings.isEnabled !== false;
  statusDot.className = "status-dot " + (enabled ? "active" : "inactive");
  statusText.textContent = "Status: " + (enabled ? "Active" : "Inactive");

  const providerId = settings.provider || "pollinations";
  providerInfo.textContent = "Provider: " + (PROVIDER_LABELS[providerId] || providerId);

  const hasKey = !!settings.apiKey;
  apiKeyIndicator.className = "api-key-indicator " + (hasKey || providerId === "pollinations" ? "set" : "not-set");
  apiKeyText.textContent =
    providerId === "pollinations"
      ? "API Key: Not required"
      : hasKey
      ? "API Key: Set"
      : "API Key: Not set";

  document
    .getElementById("openOptionsBtn")
    .addEventListener("click", () => chrome.runtime.openOptionsPage());
}

initialize();
