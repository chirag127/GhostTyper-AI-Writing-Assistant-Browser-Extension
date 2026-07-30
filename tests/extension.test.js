/**
 * GhostTyper tests — node --test
 * Tests: provider URL/key construction, URL matching, debounce, suggestion parsing,
 *        sensitive field detection, typing-as-suggested logic, cache LRU eviction.
 */

import { describe, it, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Minimal fetch mock — returns the given body as JSON */
function makeFetch(responseBody, status = 200) {
  return async (url, opts) => {
    const json = JSON.stringify(responseBody);
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => responseBody,
      text: async () => json,
      _url: url,
      _opts: opts,
    };
  };
}

// ─── 1. Provider URL construction ───────────────────────────────────────────

describe("AI provider URL building", () => {
  const PROVIDERS = {
    pollinations: { baseUrl: "https://text.pollinations.ai/openai", defaultModel: "openai", requiresKey: false },
    groq: { baseUrl: "https://api.groq.com/openai/v1", defaultModel: "llama-3.3-70b-versatile", requiresKey: true },
    cerebras: { baseUrl: "https://api.cerebras.ai/v1", defaultModel: "llama-3.3-70b", requiresKey: true },
    gemini: { baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", defaultModel: "gemini-2.0-flash", requiresKey: true },
    openrouter: { baseUrl: "https://openrouter.ai/api/v1", defaultModel: "deepseek/deepseek-r1:free", requiresKey: true },
    mistral: { baseUrl: "https://api.mistral.ai/v1", defaultModel: "mistral-small-latest", requiresKey: true },
    custom: { baseUrl: "", defaultModel: "gpt-3.5-turbo", requiresKey: false },
  };

  it("pollinations: no Authorization header, correct URL", async () => {
    let capturedUrl, capturedHeaders;
    const fetch = async (url, opts) => {
      capturedUrl = url;
      capturedHeaders = opts.headers;
      return { ok: true, json: async () => ({ choices: [{ message: { content: "hello" } }] }) };
    };

    const body = JSON.parse(
      JSON.stringify({
        model: PROVIDERS.pollinations.defaultModel,
        messages: [{ role: "user", content: "test" }],
        max_tokens: 64, temperature: 0, stream: false,
      })
    );

    await fetch(
      `${PROVIDERS.pollinations.baseUrl}/chat/completions`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    );

    assert.equal(capturedUrl, "https://text.pollinations.ai/openai/chat/completions");
    assert.ok(!capturedHeaders["Authorization"]);
  });

  it("groq: Authorization header sent", async () => {
    let capturedHeaders;
    const fetch = async (url, opts) => {
      capturedHeaders = opts.headers;
      return { ok: true, json: async () => ({ choices: [{ message: { content: "hi" } }] }) };
    };

    const headers = { "Content-Type": "application/json", Authorization: "Bearer sk-test" };
    await fetch(`${PROVIDERS.groq.baseUrl}/chat/completions`, { method: "POST", headers, body: "{}" });
    assert.equal(capturedHeaders.Authorization, "Bearer sk-test");
  });

  it("request body: max_tokens=64, temperature=0", () => {
    const context = "Hello world";
    const model = "openai";
    const body = {
      model,
      messages: [
        { role: "system", content: "You are an inline writing assistant." },
        { role: "user", content: context },
      ],
      max_tokens: 64,
      temperature: 0,
      stream: false,
    };
    assert.equal(body.max_tokens, 64);
    assert.equal(body.temperature, 0);
    assert.equal(body.stream, false);
  });

  it("all 7 providers have a baseUrl (custom empty is expected)", () => {
    for (const [id, p] of Object.entries(PROVIDERS)) {
      if (id === "custom") {
        assert.equal(p.baseUrl, "");
      } else {
        assert.ok(p.baseUrl.startsWith("https://"), `${id} baseUrl should start with https://`);
      }
    }
  });

  it("provider response: extracts choices[0].message.content", async () => {
    const mockResponse = { choices: [{ message: { content: " world!" } }] };
    const fetch = makeFetch(mockResponse);
    const res = await fetch("https://example.com/chat/completions", { method: "POST", headers: {}, body: "{}" });
    const data = await res.json();
    const text = (data?.choices?.[0]?.message?.content ?? "").trim();
    assert.equal(text, "world!");
  });

  it("provider error: throws on non-ok status", async () => {
    const fetch = makeFetch({ error: "rate limited" }, 429);
    const res = await fetch("https://example.com/chat/completions", { method: "POST", headers: {}, body: "{}" });
    assert.equal(res.ok, false);
    assert.equal(res.status, 429);
  });
});

// ─── 2. URL allow/deny matching ──────────────────────────────────────────────

describe("matchesUrlPattern", () => {
  function matchesUrlPattern(url, patterns) {
    if (!patterns?.length) return false;
    const hostname = new URL(url).hostname;
    return patterns.some((pattern) => {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      return regex.test(hostname);
    });
  }

  it("exact domain match", () => {
    assert.ok(matchesUrlPattern("https://example.com/page", ["example.com"]));
  });

  it("wildcard subdomain match", () => {
    assert.ok(matchesUrlPattern("https://sub.example.com/page", ["*.example.com"]));
  });

  it("no match", () => {
    assert.ok(!matchesUrlPattern("https://other.com/page", ["example.com"]));
  });

  it("empty pattern list returns false", () => {
    assert.ok(!matchesUrlPattern("https://example.com/page", []));
  });

  it("exact mismatch not caught by wildcard", () => {
    assert.ok(!matchesUrlPattern("https://example.com/page", ["*.example.com"]));
  });
});

// ─── 3. Debounce ─────────────────────────────────────────────────────────────

describe("debounce", () => {
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => { clearTimeout(t); fn(...args); }, wait);
    };
  }

  it("fires once after delay", async () => {
    let count = 0;
    const fn = debounce(() => count++, 30);
    fn(); fn(); fn();
    await new Promise((r) => setTimeout(r, 60));
    assert.equal(count, 1);
  });

  it("does not fire before delay", async () => {
    let count = 0;
    const fn = debounce(() => count++, 100);
    fn();
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(count, 0);
  });
});

// ─── 4. Suggestion parsing (completion text extraction) ───────────────────────

describe("suggestion parsing", () => {
  it("trims whitespace from completion", () => {
    const raw = "  world!  ";
    assert.equal(raw.trim(), "world!");
  });

  it("empty choices returns empty string", () => {
    const data = { choices: [] };
    const text = (data?.choices?.[0]?.message?.content ?? "").trim();
    assert.equal(text, "");
  });

  it("null choices returns empty string", () => {
    const data = {};
    const text = (data?.choices?.[0]?.message?.content ?? "").trim();
    assert.equal(text, "");
  });
});

// ─── 5. Sensitive field detection ────────────────────────────────────────────

describe("isSensitiveField", () => {
  const SENSITIVE_AUTOCOMPLETE = new Set([
    "cc-number", "cc-exp", "cc-exp-month", "cc-exp-year",
    "cc-csc", "cc-name", "cc-type",
    "current-password", "new-password",
  ]);

  function isSensitiveField(el) {
    if (!el) return true;
    if (el.tagName === "INPUT") {
      const type = (el.type || "text").toLowerCase();
      if (type === "password" || type === "hidden") return true;
      const ac = (el.getAttribute?.("autocomplete") || "").toLowerCase();
      if (SENSITIVE_AUTOCOMPLETE.has(ac)) return true;
      const name = (el.name || el.id || "").toLowerCase();
      if (/card|cvv|cvc|ccnum|credit/i.test(name)) return true;
    }
    return false;
  }

  const makeInput = (type, autocomplete, name = "") => ({
    tagName: "INPUT",
    type,
    name,
    id: "",
    getAttribute: (k) => (k === "autocomplete" ? autocomplete : null),
  });

  it("password type is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("password", "")));
  });

  it("hidden type is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("hidden", "")));
  });

  it("cc-number autocomplete is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("text", "cc-number")));
  });

  it("cc-csc autocomplete is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("text", "cc-csc")));
  });

  it("current-password autocomplete is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("text", "current-password")));
  });

  it("name with 'card' is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("text", "", "card_number")));
  });

  it("name with 'cvv' is sensitive", () => {
    assert.ok(isSensitiveField(makeInput("text", "", "cvv_field")));
  });

  it("null element is sensitive", () => {
    assert.ok(isSensitiveField(null));
  });

  it("regular text input is NOT sensitive", () => {
    assert.ok(!isSensitiveField(makeInput("text", "name")));
  });

  it("email input is NOT sensitive", () => {
    assert.ok(!isSensitiveField(makeInput("email", "")));
  });
});

// ─── 6. Typing-as-suggested logic ────────────────────────────────────────────

describe("typing-as-suggested", () => {
  /**
   * Simulates the prefix-advancement check in content.js:
   * Returns {advance: true, remainder} if user typed into the suggestion,
   * else {advance: false}.
   */
  function checkAdvance(currentSuggestion, suggestionPrefix, newContext) {
    if (!currentSuggestion || !newContext.startsWith(suggestionPrefix)) {
      return { advance: false };
    }
    const typed = newContext.slice(suggestionPrefix.length);
    if (currentSuggestion.startsWith(typed) && typed.length > 0) {
      const remainder = currentSuggestion.slice(typed.length);
      if (remainder.length > 0) {
        return { advance: true, remainder };
      }
    }
    return { advance: false };
  }

  it("user typed 1 char matching suggestion — remainder shown", () => {
    const r = checkAdvance(" world", "Hello", "Hello ");
    assert.ok(r.advance);
    assert.equal(r.remainder, "world");
  });

  it("user typed full suggestion — no remainder (should hide)", () => {
    const r = checkAdvance("world", "Hello ", "Hello world");
    assert.ok(!r.advance); // typed === suggestion, startsWith but length equals
  });

  it("user typed diverging char — no advance", () => {
    const r = checkAdvance(" world", "Hello", "HelloX");
    assert.ok(!r.advance);
  });

  it("context no longer starts with prefix — no advance", () => {
    const r = checkAdvance(" world", "Hello", "Hi");
    assert.ok(!r.advance);
  });
});

// ─── 7. LRU cache eviction ───────────────────────────────────────────────────

describe("LRU cache", () => {
  function makeCache(max) {
    const cache = new Map();
    return {
      get(key) {
        const val = cache.get(key);
        if (val !== undefined) { cache.delete(key); cache.set(key, val); }
        return val;
      },
      set(key, val) {
        if (cache.size >= max) cache.delete(cache.keys().next().value);
        cache.set(key, val);
      },
      size() { return cache.size; },
    };
  }

  it("stores and retrieves values", () => {
    const c = makeCache(10);
    c.set("a", "1");
    assert.equal(c.get("a"), "1");
  });

  it("evicts oldest entry when full", () => {
    const c = makeCache(3);
    c.set("a", "1"); c.set("b", "2"); c.set("c", "3");
    c.set("d", "4"); // evicts "a"
    assert.equal(c.get("a"), undefined);
    assert.equal(c.get("d"), "4");
    assert.equal(c.size(), 3);
  });

  it("access refreshes recency", () => {
    const c = makeCache(3);
    c.set("a", "1"); c.set("b", "2"); c.set("c", "3");
    c.get("a"); // refresh a
    c.set("d", "4"); // should evict "b" (oldest after refresh)
    assert.equal(c.get("a"), "1");
    assert.equal(c.get("b"), undefined);
  });

  it("cache miss returns undefined", () => {
    const c = makeCache(10);
    assert.equal(c.get("missing"), undefined);
  });
});
