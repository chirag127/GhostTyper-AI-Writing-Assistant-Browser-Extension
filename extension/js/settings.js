/**
 * Settings page for GhostTyper
 */

import { PROVIDERS } from "./ai-providers.js";
import { storage } from "./utils.js";

const DEFAULT_SETTINGS = {
  isEnabled: true,
  provider: "pollinations",
  apiKey: "",
  model: "",
  customBaseUrl: "",
  triggerDelay: 150,
  presentationMode: "inline",
  siteList: [],
};

const $ = (id) => document.getElementById(id);

const form = $("settingsForm");
const isEnabledToggle = $("isEnabled");
const providerSelect = $("provider");
const apiKeyInput = $("apiKey");
const toggleApiKeyBtn = $("toggleApiKey");
const modelInput = $("model");
const customBaseUrlGroup = $("customBaseUrlGroup");
const apiKeyGroup = $("apiKeyGroup");
const triggerDelayInput = $("triggerDelay");
const triggerDelayValue = $("triggerDelayValue");
const presentationModeRadios = document.getElementsByName("presentationMode");
const siteListTextarea = $("siteList");
const clearDataBtn = $("clearDataBtn");
const saveStatus = $("saveStatus");

async function initialize() {
  const stored = await storage.get(Object.keys(DEFAULT_SETTINGS));
  const settings = { ...DEFAULT_SETTINGS, ...stored };
  populateForm(settings);
  addEventListeners();
}

function populateForm(s) {
  isEnabledToggle.checked = s.isEnabled;
  providerSelect.value = s.provider || "pollinations";
  apiKeyInput.value = s.apiKey || "";
  modelInput.value = s.model || "";
  customBaseUrlGroup.value = s.customBaseUrl || "";
  triggerDelayInput.value = s.triggerDelay;
  triggerDelayValue.textContent = s.triggerDelay;
  for (const r of presentationModeRadios) {
    r.checked = r.value === s.presentationMode;
  }
  if (Array.isArray(s.siteList)) {
    siteListTextarea.value = s.siteList.join("\n");
  }
  updateProviderUI(s.provider || "pollinations");
}

function updateProviderUI(providerId) {
  const provider = PROVIDERS[providerId];
  customBaseUrlGroup.style.display = providerId === "custom" ? "" : "none";
  // Pollinations needs no key
  apiKeyGroup.style.display =
    providerId === "pollinations" ? "none" : "";
}

function addEventListeners() {
  providerSelect.addEventListener("change", () =>
    updateProviderUI(providerSelect.value)
  );
  triggerDelayInput.addEventListener("input", () => {
    triggerDelayValue.textContent = triggerDelayInput.value;
  });
  toggleApiKeyBtn.addEventListener("click", () => {
    if (apiKeyInput.type === "password") {
      apiKeyInput.type = "text";
      toggleApiKeyBtn.textContent = "Hide";
    } else {
      apiKeyInput.type = "password";
      toggleApiKeyBtn.textContent = "Show";
    }
  });
  clearDataBtn.addEventListener("click", async () => {
    if (confirm("Clear all data including API key?")) {
      await storage.remove(Object.keys(DEFAULT_SETTINGS));
      populateForm(DEFAULT_SETTINGS);
      showStatus("Data cleared.", "success");
    }
  });
  form.addEventListener("submit", handleSubmit);
}

async function handleSubmit(e) {
  e.preventDefault();
  const settings = {
    isEnabled: isEnabledToggle.checked,
    provider: providerSelect.value,
    apiKey: apiKeyInput.value.trim(),
    model: modelInput.value.trim(),
    customBaseUrl: ($("customBaseUrl") || { value: "" }).value.trim(),
    triggerDelay: parseInt(triggerDelayInput.value, 10),
    presentationMode: [...presentationModeRadios].find((r) => r.checked)?.value ?? "inline",
    siteList: siteListTextarea.value
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  };
  try {
    await storage.set(settings);
    showStatus("Settings saved.", "success");
  } catch (err) {
    showStatus("Save failed. Try again.", "error");
  }
}

function showStatus(msg, type) {
  saveStatus.textContent = msg;
  saveStatus.className = `save-status ${type}`;
  setTimeout(() => {
    saveStatus.textContent = "";
    saveStatus.className = "save-status";
  }, 3000);
}

initialize();
