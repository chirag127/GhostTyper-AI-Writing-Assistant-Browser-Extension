# GhostTyper-AI-Writing-Assistant-Browser-Extension

[![Build Status](https://img.shields.io/github/actions/workflow/status/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/ci.yml?style=flat-square)](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml)
[![codecov](https://img.shields.io/codecov/c/github/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension?style=flat-square)](https://codecov.io/github/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.7-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.0-yellow?style=flat-square)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-purple?style=flat-square)](https://tailwindcss.com/)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-green?style=flat-square)](https://tauri.app/)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-orange?style=flat-square)](https://creativecommons.org/licenses/by-nc/4.0/)
[![GitHub Stars](https://img.shields.io/github/stars/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension?style=flat-square)](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/stargazers)

<br>

:star: **Star this Repo** :star:

--- About GhostTyper ---

GhostTyper is a real-time AI writing assistant browser extension designed to integrate seamlessly with your workflow. Leveraging Google Gemini, it provides inline, Copilot-style suggestions directly within any text field, significantly boosting productivity. The 'Tab-to-accept' feature allows for rapid integration of suggestions. Compatible with Chrome and Firefox.

--- Architecture ---

mermaid
graph TD
    A[User Input in Text Field] --> B(Browser Extension)
    B --> C{Content Script}
    C --> D[Detects Input & Context]
    D --> E[Sends Request to Backend/Service]
    E --> F{Google Gemini API}
    F --> G[AI-Powered Suggestions]
    G --> E
    E --> C
    C --> H[Displays Inline Suggestions]
    H --> I{User Action (Tab Key)}
    I --> C
    C --> J[Accepts Suggestion]
    J --> A

    subgraph Frontend
        B
        C
        D
        H
        I
        J
    end

    subgraph Backend/AI Integration
        E
        F
        G
    end


--- Table of Contents ---

*   [About GhostTyper](#about-ghosttyper)
*   [Architecture](#architecture)
*   [Features](#features)
*   [AI Agent Directives](#ai-agent-directives)
*   [Development Standards](#development-standards)
*   [Setup & Installation](#setup--installation)
*   [Usage](#usage)
*   [Contributing](#contributing)
*   [License](#license)

--- Features ---

*   **Real-time Inline Suggestions:** Get AI-powered writing assistance as you type.
*   **Copilot-Style Integration:** Seamlessly fits into your existing writing flow.
*   **Google Gemini Powered:** Utilizes advanced AI models for contextual and accurate suggestions.
*   **Tab-to-Accept:** Quickly accept suggestions with a single keystroke.
*   **Cross-Browser Compatibility:** Supports Chrome and Firefox.
*   **Lightweight & Efficient:** Designed for minimal performance impact.

---

<details>
  <summary>🤖 AI AGENT DIRECTIVES</summary>

### SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

*   **Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
*   **Context:** Current Date is **December 2025**. You are building for the 2026 standard.
*   **Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
*   **Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

--- INPUT PROCESSING & COGNITION ---

*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

--- CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS) ---

*   **PRIMARY SCENARIO A: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict)**, **Vite 7 (Rolldown)** for build tooling, **TailwindCSS v4** for styling, and **Tauri v2.x** for native integration.
    *   **State Management:** Utilizes **Signals (Standardized)** for efficient and declarative state updates.
    *   **Linting & Formatting:** Employs **Biome** for ultra-fast code analysis and formatting.
    *   **Testing:** Integrates **Vitest** for unit testing and **Playwright** for end-to-end (E2E) testing.
    *   **Architecture:** Adheres to **Feature-Sliced Design (FSD)** principles for scalable and maintainable frontend architecture.
    *   **Browser API:** Leverages the Web Extension API (Manifest V3+).

*   **AI Integration:** Deeply integrated with **Google Gemini API** (`gemini-3-pro` by default) for intelligent text generation and suggestion capabilities. Prioritize modular design, clear API contracts, and robust error handling for all AI model interactions.

</details>

---

## Development Standards

*   **Principles:** Adhere to SOLID, DRY, and YAGNI principles.
*   **Language:** TypeScript (Strict Mode Enabled)
*   **Framework:** Vite 7
*   **Styling:** TailwindCSS v4
*   **Native Integration:** Tauri v2.x
*   **State Management:** Signals
*   **Linting & Formatting:** Biome
*   **Testing:** Vitest (Unit), Playwright (E2E)
*   **Architecture:** Feature-Sliced Design (FSD)
*   **Browser API:** Web Extension API (Manifest V3+)

---

## Setup & Installation

### Prerequisites

*   Node.js v20+
*   npm v10+
*   Rust (for Tauri backend if needed)

### Installation Steps

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension.git
    cd GhostTyper-AI-Writing-Assistant-Browser-Extension
    

2.  **Install Dependencies:**
    bash
    npm install
    

3.  **Configure Environment Variables (if any):**
    Ensure your Google Gemini API key is set as an environment variable (e.g., `GOOGLE_API_KEY`) or configured in your `.env` file.

---

## Usage

1.  **Build the Extension:**
    bash
    npm run build
    

2.  **Load in Browser:**
    *   **Chrome:** Open `chrome://extensions/`, enable Developer mode, click "Load unpacked", and select the `dist` folder (or the relevant output directory from Tauri's build process).
    *   **Firefox:** Open `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on", and select the `manifest.json` file.

3.  **Activate:** Once loaded, GhostTyper will automatically provide suggestions in supported text fields.

---

## Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -am 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Create a new Pull Request.

Please ensure your code adheres to the established standards and passes all tests.

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0)**.

See the [LICENSE](LICENSE) file for more details.
