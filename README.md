# GhostTyper

[![Stars](https://img.shields.io/github/stars/chirag127/ghosttyper-bs-ext?style=flat-square)](https://github.com/chirag127/ghosttyper-bs-ext/stargazers)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/chirag127/ghosttyper-bs-ext?style=flat-square)](https://github.com/chirag127/ghosttyper-bs-ext/releases/latest)

**Live site:** https://ghosttyper-bs-ext.oriz.in

Copilot-style inline AI writing suggestions in any text field — Gmail, Notion, Twitter, web forms, anywhere. Press **Tab** or **Right Arrow** to accept. 100% client-side, no backend, no telemetry.

---

## What it does

As you type, GhostTyper fetches a short AI completion for the text before your cursor and renders it inline as greyed-out ghost text. Keep typing to dismiss; press Tab or Right Arrow to accept instantly.

---

## 7 providers (all free-tier)

| Provider | Key required | Default model | Notes |
|---|---|---|---|
| **Pollinations** (default) | No | openai | Zero-config. Works immediately. |
| Groq | Yes | llama-3.3-70b-versatile | console.groq.com |
| Cerebras | Yes | llama-3.3-70b | cloud.cerebras.ai |
| Google Gemini | Yes | gemini-2.0-flash | aistudio.google.com |
| OpenRouter | Yes | deepseek/deepseek-r1:free | openrouter.ai |
| Mistral | Yes | mistral-small-latest | console.mistral.ai |
| Custom | Optional | Your choice | Any OpenAI-compatible endpoint |

---

## Install

1. Download [ghosttyper.zip](https://github.com/chirag127/ghosttyper-bs-ext/releases/latest) from the latest release.
2. Unzip the file.
3. Open Chrome (or Edge / Brave / Arc) and go to `chrome://extensions`.
4. Enable **Developer mode** (top right).
5. Click **Load unpacked** and select the `extension/` folder.

No account. No sign-up. Works immediately with the Pollinations default.

---

## How it works

1. Content script monitors text inputs across all tabs.
2. After a 150ms debounce, the context prefix (text before cursor) is sent to the service worker.
3. Service worker checks an in-memory LRU cache (64 entries), then calls your configured provider via OpenAI-compatible `/chat/completions` (`max_tokens=64`, `temperature=0`).
4. Suggestion renders as an overlay (mirror technique for `<input>`/`<textarea>`; Selection/Range API ghost span for `contentEditable`).
5. **Tab** or **Right Arrow** accepts; **Esc** / arrow keys / Enter dismiss.

### UX optimisations (Copilot-tier)
- **Typing-as-suggested**: if you keep typing characters that match the current suggestion, the remainder is shown instantly without a new API call.
- **LRU cache**: repeated prefixes never hit the network.
- **Silent-disable**: after 3 consecutive provider errors, ghost text silently stops for that tab session — no error spam.
- **Min/max line guards**: fires only when current line has 3–240 chars.

---

## Privacy

GhostTyper is 100% client-side. Text goes browser → your chosen provider. No GhostTyper server exists.

**Sensitive fields always excluded** — GhostTyper never reads or sends text from:
- `input[type=password]`
- Credit-card fields (`autocomplete=cc-*`: cc-number, cc-csc, cc-exp, cc-name, cc-type)
- Hidden inputs
- Inputs whose name/id match credit-card patterns

See [Privacy Policy](https://ghosttyper-bs-ext.oriz.in/privacy.html) for full details.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| **Tab** | Accept suggestion |
| **Right Arrow** | Accept suggestion (fallback — useful when Tab is remapped) |
| **Esc** | Dismiss suggestion |
| Any other key | Keep typing (dismisses suggestion) |

---

## Configuration

Open the extension popup and click **Open Settings**.

| Setting | Default | Description |
|---|---|---|
| Provider | Pollinations | AI provider |
| API Key | (empty) | Not needed for Pollinations |
| Model | (provider default) | Override the model |
| Custom Base URL | (empty) | For Custom provider |
| Trigger Delay | 150ms | Debounce before fetching |
| Presentation Mode | Inline | Inline / Popup / Panel |
| Blocked Sites | (empty) | Domains where suggestions are disabled |

---

## Contributing

PRs welcome. Open an issue first for large changes.

```bash
git clone https://github.com/chirag127/ghosttyper-bs-ext
# Load extension/ unpacked in Chrome for development
# Run tests:
node --test tests/
```

---

## License

MIT — see [LICENSE](LICENSE).
