/**
 * Content Script for GhostTyper
 *
 * Best practices implemented:
 * 1. Debounce 150ms default
 * 2. Tab + Right Arrow to accept
 * 3. Min 3 chars on current line; max 240 chars
 * 4. max_tokens=64, temperature=0 (set in ai-providers.js)
 * 5. Typing-as-suggested: match prefix advancement without new API call
 * 6. Caching in background.js (service worker)
 * 7. Silent-disable on persistent provider errors
 * 8. Privacy: exclude password, cc-*, sensitive fields
 * 9. Ghost overlay for input/textarea; Range API for contentEditable
 */

import {
  debounce,
  matchesUrlPattern,
  isTextInputField,
  getCursorPosition,
  getTextContent,
  insertTextAtCursor,
  getCursorCoordinates,
} from "./utils.js";

// --- Sensitive field detection (privacy) ---
const SENSITIVE_AUTOCOMPLETE = new Set([
  "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year",
  "cc-csc", "cc-name", "cc-type",
  "current-password", "new-password",
]);

function isSensitiveField(el) {
  if (!el) return true;
  const tag = el.tagName;
  if (tag === "INPUT") {
    const type = (el.type || "text").toLowerCase();
    if (type === "password" || type === "hidden") return true;
    const ac = (el.getAttribute("autocomplete") || "").toLowerCase();
    if (SENSITIVE_AUTOCOMPLETE.has(ac)) return true;
    // heuristic: credit-card like names
    const name = (el.name || el.id || "").toLowerCase();
    if (/card|cvv|cvc|ccnum|credit/i.test(name)) return true;
  }
  return false;
}

// --- State ---
let settings = {
  isEnabled: true,
  provider: "pollinations",
  apiKey: "",
  model: "",
  customBaseUrl: "",
  siteList: [],
  triggerDelay: 150,
  presentationMode: "inline",
};
let silenced = false;
let activeElement = null;
let currentSuggestion = "";
let suggestionPrefix = ""; // the prefix that produced currentSuggestion

const overlays = new WeakMap(); // element -> overlay div

// --- Boot ---
async function initialize() {
  try {
    const res = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
    settings = res.settings;
  } catch (_) {}

  if (!isEnabledForSite()) return;

  setupEventListeners();
  setupMutationObserver();
}

function isEnabledForSite() {
  if (!settings.isEnabled) return false;
  if (settings.siteList?.length) {
    if (matchesUrlPattern(window.location.href, settings.siteList)) return false;
  }
  return true;
}

// --- Event wiring ---
function setupEventListeners() {
  document.addEventListener("focusin", handleFocusIn);
  document.addEventListener("focusout", handleFocusOut);
  document.addEventListener("keydown", handleKeyDown, true);
}

function setupMutationObserver() {
  const attach = (el) => {
    if (isTextInputField(el) && !el._gtAttached) {
      el.addEventListener("input", handleInput);
      el._gtAttached = true;
    }
  };

  const observer = new MutationObserver((muts) => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        attach(node);
        node.querySelectorAll?.('input,textarea,[contenteditable="true"]').forEach(attach);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document
    .querySelectorAll('input,textarea,[contenteditable="true"]')
    .forEach(attach);
}

// --- Focus handlers ---
function handleFocusIn(e) {
  if (isTextInputField(e.target)) activeElement = e.target;
}

function handleFocusOut() {
  hideSuggestion();
  activeElement = null;
}

// --- Input handler ---
const handleInput = debounce((e) => {
  if (silenced) return;
  const el = e.target;
  if (!isTextInputField(el) || isSensitiveField(el)) return;
  activeElement = el;

  const text = getTextContent(el);
  const cursorPos = getCursorPosition(el);
  const context = text.substring(0, cursorPos);

  // Current line = text after last newline
  const lineStart = context.lastIndexOf("\n") + 1;
  const currentLine = context.substring(lineStart);

  // Min 3 chars, max 240 chars on current line
  if (currentLine.trimStart().length < 3 || currentLine.length > 240) {
    hideSuggestion();
    return;
  }

  // Typing-as-suggested optimisation: if user typed chars that advance into
  // the current ghost suggestion, shift the remainder without a new API call.
  if (currentSuggestion && context.startsWith(suggestionPrefix)) {
    const typed = context.slice(suggestionPrefix.length);
    if (currentSuggestion.startsWith(typed)) {
      const remainder = currentSuggestion.slice(typed.length);
      if (remainder.length > 0) {
        suggestionPrefix = context;
        currentSuggestion = remainder;
        renderSuggestion(el, remainder);
        return;
      }
    }
  }

  requestSuggestion(el, context);
}, settings.triggerDelay || 150);

// --- API request ---
async function requestSuggestion(el, context) {
  try {
    const res = await chrome.runtime.sendMessage({
      type: "GENERATE_SUGGESTION",
      context,
    });

    if (res.silent) {
      silenced = true;
      hideSuggestion();
      return;
    }

    if (!res.success || !res.suggestion) {
      hideSuggestion();
      return;
    }

    // Verify the element/context is still active
    if (el !== activeElement) return;
    const nowText = getTextContent(el).substring(0, getCursorPosition(el));
    if (nowText !== context) return;

    currentSuggestion = res.suggestion;
    suggestionPrefix = context;
    renderSuggestion(el, res.suggestion);
  } catch (_) {
    hideSuggestion();
  }
}

// --- Keyboard handler (Tab + Right Arrow to accept) ---
function handleKeyDown(e) {
  if (!activeElement || !currentSuggestion) return;

  const isTab = e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey;
  const isRight = e.key === "ArrowRight" && !e.shiftKey && !e.ctrlKey && !e.altKey;

  if (isTab || isRight) {
    e.preventDefault();
    e.stopPropagation();
    acceptSuggestion();
    return;
  }

  if (
    e.key === "Escape" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "Enter"
  ) {
    hideSuggestion();
  }
}

function acceptSuggestion() {
  if (!activeElement || !currentSuggestion) return;
  insertTextAtCursor(activeElement, currentSuggestion);
  hideSuggestion();
  activeElement.dispatchEvent(new Event("input", { bubbles: true }));
}

// --- Rendering ---
function renderSuggestion(el, text) {
  if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
    renderOverlay(el, text);
  } else if (el.isContentEditable) {
    renderContentEditable(el, text);
  }
}

// --- Overlay for input/textarea ---
function getOrCreateOverlay(el) {
  if (overlays.has(el)) return overlays.get(el);

  const ov = document.createElement("div");
  ov.className = "ghosttyper-overlay";
  ov.style.cssText = [
    "position:absolute",
    "pointer-events:none",
    "z-index:2147483647",
    "overflow:hidden",
    "white-space:pre-wrap",
    "word-break:break-word",
  ].join(";");
  document.body.appendChild(ov);
  overlays.set(el, ov);

  // Remove overlay when element is removed
  new MutationObserver(() => {
    if (!document.body.contains(el)) {
      ov.remove();
      overlays.delete(el);
    }
  }).observe(document.body, { childList: true, subtree: true });

  return ov;
}

function renderOverlay(el, suggestion) {
  const ov = getOrCreateOverlay(el);
  const rect = el.getBoundingClientRect();
  const cs = window.getComputedStyle(el);

  // Match element's font exactly
  ov.style.top = `${rect.top + window.scrollY}px`;
  ov.style.left = `${rect.left + window.scrollX}px`;
  ov.style.width = `${rect.width}px`;
  ov.style.height = `${rect.height}px`;
  ov.style.fontFamily = cs.fontFamily;
  ov.style.fontSize = cs.fontSize;
  ov.style.fontWeight = cs.fontWeight;
  ov.style.lineHeight = cs.lineHeight;
  ov.style.padding = cs.padding;
  ov.style.border = "none";
  ov.style.background = "transparent";
  ov.style.boxSizing = cs.boxSizing;
  ov.style.letterSpacing = cs.letterSpacing;

  const cursorPos = getCursorPosition(el);
  const text = getTextContent(el);

  // Build: [visible text before cursor][grey suggestion][text after cursor]
  ov.innerHTML = "";

  const before = document.createElement("span");
  before.textContent = text.substring(0, cursorPos);
  before.style.color = "transparent"; // hidden — sits under real text

  const ghost = document.createElement("span");
  ghost.textContent = suggestion;
  ghost.style.cssText = "color:#888;opacity:0.75;";

  const after = document.createElement("span");
  after.textContent = text.substring(cursorPos);
  after.style.color = "transparent";

  ov.appendChild(before);
  ov.appendChild(ghost);
  ov.appendChild(after);
  ov.style.display = "block";
}

// --- ContentEditable ghost span ---
let ceGhostSpan = null;

function renderContentEditable(el, suggestion) {
  removeContentEditableGhost();

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(false); // cursor position

  ceGhostSpan = document.createElement("span");
  ceGhostSpan.className = "ghosttyper-ce-ghost";
  ceGhostSpan.textContent = suggestion;
  ceGhostSpan.contentEditable = "false";
  ceGhostSpan.style.cssText = "color:#888;opacity:0.75;pointer-events:none;";

  range.insertNode(ceGhostSpan);

  // Restore cursor before ghost span
  const restoreRange = document.createRange();
  restoreRange.setStartBefore(ceGhostSpan);
  restoreRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(restoreRange);
}

function removeContentEditableGhost() {
  if (ceGhostSpan) {
    ceGhostSpan.remove();
    ceGhostSpan = null;
  }
}

// --- Hide / clear ---
function hideSuggestion() {
  currentSuggestion = "";
  suggestionPrefix = "";

  // Hide overlays
  for (const [, ov] of overlays) ov.style.display = "none";
  removeContentEditableGhost();
}

initialize();
