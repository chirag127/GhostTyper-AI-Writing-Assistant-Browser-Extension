# GhostTyper — AI Writing Assistant Browser Extension

Real-time AI writing assistant browser extension. Inline, Copilot-style suggestions from Google Gemini in any text field. Tab-to-accept. Chrome & Firefox.

**Live:** https://GhostTyper-AI-Writing-Assistant-Browser-Extension.oriz.in

[![GitHub stars](https://img.shields.io/github/stars/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension?style=flat-square)](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/ci.yml?style=flat-square)](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml)

## What it does

GhostTyper watches text fields on any page and streams inline, greyed-out completions from Google Gemini as you type. Press `Tab` to accept, keep typing to ignore. Works in `<input>`, `<textarea>`, and `contenteditable` elements.

## Architecture

- **`extension/`** — Manifest V3 browser extension (vanilla JS). Content script detects input + context, background service worker relays requests, popup + settings pages for config.
- **`backend/`** — Express server that proxies Google Gemini, keeps the API key server-side, and records optional telemetry.

```
User types → content script → background worker → Express backend → Gemini API → inline suggestion → Tab accepts
```

## Tech

- Extension: Manifest V3, vanilla JavaScript, HTML/CSS
- Backend: Node.js, Express, `@google/generative-ai`
- AI: Google Gemini

## Setup

### Prerequisites

- Node.js v20+
- A Google Gemini API key

### Backend

```bash
cd backend
cp .env.example .env      # add your GEMINI_API_KEY
npm install
npm start
```

### Extension

**Chrome:** open `chrome://extensions/`, enable Developer mode, click "Load unpacked", select the `extension/` folder.

**Firefox:** open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", select `extension/manifest.json`.

Open the extension settings page to point it at your backend URL, then start typing in any text field.

## Usage

1. Load the extension and start the backend.
2. Focus any text field on the web.
3. A greyed-out suggestion appears as you type.
4. Press `Tab` to accept, or keep typing to dismiss.

## License

MIT — see [LICENSE](LICENSE).
