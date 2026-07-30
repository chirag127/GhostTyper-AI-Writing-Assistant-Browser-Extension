/**
 * Background Service Worker for GhostTyper
 * Handles API calls, LRU cache, and silent-disable on persistent errors.
 */

import { getCompletion } from "./ai-providers.js";

const DEFAULT_SETTINGS = {
  isEnabled: true,
  provider: "pollinations",
  apiKey: "",
  model: "",
  customBaseUrl: "",
  siteList: [],
  triggerDelay: 150,
  presentationMode: "inline",
};

// LRU cache: prefix -> completion (max 64 entries)
const CACHE_MAX = 64;
const cache = new Map();

function cacheGet(key) {
  const val = cache.get(key);
  if (val !== undefined) {
    // refresh recency
    cache.delete(key);
    cache.set(key, val);
  }
  return val;
}

function cacheSet(key, val) {
  if (cache.size >= CACHE_MAX) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, val);
}

// Silent-disable: track consecutive errors per tab session
const errorCounts = new Map();
const ERROR_THRESHOLD = 3;

function markError(tabId) {
  errorCounts.set(tabId, (errorCounts.get(tabId) ?? 0) + 1);
}
function resetError(tabId) {
  errorCounts.delete(tabId);
}
function isSilenced(tabId) {
  return (errorCounts.get(tabId) ?? 0) >= ERROR_THRESHOLD;
}

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS));
  await chrome.storage.local.set({ ...DEFAULT_SETTINGS, ...stored });
  updateBadge(stored.isEnabled ?? DEFAULT_SETTINGS.isEnabled);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.isEnabled) updateBadge(changes.isEnabled.newValue);
    // Reset silence on provider change
    if (changes.provider) errorCounts.clear();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_SETTINGS") {
    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), (stored) => {
      sendResponse({ settings: { ...DEFAULT_SETTINGS, ...stored } });
    });
    return true;
  }

  if (message.type === "GENERATE_SUGGESTION") {
    const tabId = sender.tab?.id ?? -1;

    // Silent-disable: too many consecutive errors this session
    if (isSilenced(tabId)) {
      sendResponse({ success: false, silent: true });
      return true;
    }

    const prefix = message.context;

    // Cache hit
    const cached = cacheGet(prefix);
    if (cached !== undefined) {
      sendResponse({ success: true, suggestion: cached });
      return true;
    }

    chrome.storage.local.get(Object.keys(DEFAULT_SETTINGS), async (stored) => {
      const settings = { ...DEFAULT_SETTINGS, ...stored };
      try {
        const suggestion = await getCompletion(prefix, settings);
        cacheSet(prefix, suggestion);
        resetError(tabId);
        sendResponse({ success: true, suggestion });
      } catch (err) {
        console.warn("[GhostTyper] provider error:", err.message);
        markError(tabId);
        sendResponse({ success: false, error: err.message, silent: isSilenced(tabId) });
        if (!isSilenced(tabId)) {
          chrome.action.setBadgeText({ text: "!" });
          chrome.action.setBadgeBackgroundColor({ color: "#F44336" });
          setTimeout(
            () =>
              chrome.storage.local.get("isEnabled", ({ isEnabled }) =>
                updateBadge(isEnabled)
              ),
            5000
          );
        }
      }
    });
    return true;
  }
});

function updateBadge(isEnabled) {
  if (isEnabled) {
    chrome.action.setBadgeText({ text: "" });
  } else {
    chrome.action.setBadgeText({ text: "OFF" });
    chrome.action.setBadgeBackgroundColor({ color: "#9E9E9E" });
  }
}
