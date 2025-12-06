<p align="center">
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://raw.githubusercontent.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/main/assets/ghosttyper-logo.svg" alt="GhostTyper Logo" width="150">
  </a>
</p>

<h1 align="center">GhostTyper-AI-Writing-Assistant-Browser-Extension</h1>

<p align="center">
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/ci.yml?branch=main&style=flat-square" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/codecov/c/github/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/main?style=flat-square&token=YOUR_CODECOV_TOKEN" alt="Code Coverage">
  </a>
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/github/languages/top/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension?style=flat-square" alt="Top Language">
  </a>
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/badge/Framework-WXT%20%7C%20Express.js-blueviolet?style=flat-square" alt="Framework">
  </a>
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/badge/Linter%2FFormatter-Biome-informational?style=flat-square" alt="Linter/Formatter">
  </a>
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension">
    <img src="https://img.shields.io/badge/Tests-Vitest%20%7C%20Playwright-success?style=flat-square" alt="Tests">
  </a>
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension?style=flat-square" alt="License">
  </a>
</p>

<p align="center">
  <a href="https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/stargazers">⭐ Star this Repo</a>
</p>

---

## 📝 Real-time AI Writing Assistant Browser Extension

GhostTyper is an advanced browser extension that provides inline, Copilot-style writing suggestions powered by Google Gemini, enhancing productivity across any web-based text field. Boost your writing efficiency with seamless, intelligent text completion and generation, available for Chrome and Firefox.

## 🚀 Features

*   **Inline AI Suggestions:** Get real-time, context-aware writing suggestions directly in your input fields.
*   **Google Gemini Integration:** Leverages the power of Google Gemini for high-quality, relevant AI outputs.
*   **Tab-to-Accept:** Effortlessly accept suggestions with a single `Tab` press, streamlining your workflow.
*   **Cross-Browser Compatibility:** Supports both Chrome and Firefox browsers.
*   **Privacy-Focused:** Designed with user privacy in mind, minimizing data collection.

## 🧠 Architecture

GhostTyper employs a modular and scalable architecture based on the Feature-Sliced Design (FSD) methodology, ensuring clear separation of concerns, maintainability, and extensibility. The core components interact seamlessly to deliver real-time AI assistance within the browser environment.

mermaid
C4Context
    title System Context Diagram for GhostTyper Extension
    Person(user, "User", "Interacts with web pages and text inputs")
    System(gemini_api, "Google Gemini API", "Provides AI-powered text generation and suggestions")

    System_Boundary(ghosttyper, "GhostTyper Browser Extension") {
        Container(popup_ui, "Popup UI", "React/WXT - Extension popup for settings & controls")
        Container(content_script, "Content Script", "TypeScript - Injects into web pages to detect text fields and render suggestions")
        Container(background_script, "Background Script", "TypeScript/WXT - Manages API calls, state, and inter-script communication")
        Container(options_ui, "Options UI", "React/WXT - Extension options page for API key and advanced settings")
        Container(api_proxy, "Express.js Proxy (Optional)", "Node.js/Express - Securely proxies requests to Google Gemini API (if direct client-side calls are restricted/not preferred)")
    }

    Rel(user, popup_ui, "Configures")
    Rel(user, content_script, "Types in text field, sees suggestions")
    Rel(content_script, background_script, "Requests suggestions for text, sends user input")
    Rel(background_script, api_proxy, "Sends text for AI processing", "HTTPS")
    Rel(api_proxy, gemini_api, "Forwards request, receives AI response", "HTTPS")
    Rel(background_script, gemini_api, "Sends text for AI processing (if no proxy)", "HTTPS")
    Rel(background_script, content_script, "Sends AI suggestions back for display")
    Rel(user, options_ui, "Manages settings")
    Rel(options_ui, background_script, "Updates settings")


<details>
<summary>📦 Directory Structure</summary>


.github/
├── workflows/
│   └── ci.yml
├── CONTRIBUTING.md
├── ISSUE_TEMPLATE/
│   └── bug_report.md
├── PULL_REQUEST_TEMPLATE.md
└── SECURITY.md
src/
├── app/             # Application entry point & core logic
│   ├── index.ts
│   └── providers/
├── entities/        # Core business objects (e.g., User, Suggestion)
│   └── suggestion/
├── features/        # Interactive functionalities (e.g., inline-suggestions, tab-accept)
│   └── inline-suggestions/
├── pages/           # Full-page components (e.g., options page)
│   └── options/
├── widgets/         # UI blocks composed of entities/features (e.g., AI output panel)
│   └── suggestion-popup/
├── shared/          # Reusable utilities, UI components, types
│   ├── api/
│   ├── lib/
│   └── ui/
├── manifest.ts      # WXT manifest configuration
├── content-scripts/ # Scripts injected into web pages
│   └── index.ts
├── background/      # Background service worker script
│   └── index.ts
└── popup/           # Extension popup UI
    └── index.html
assets/              # Static assets (logos, icons)
├── ghosttyper-logo.svg
└── icons/
public/
├── _locales/
└── manifest.json
tests/
├── unit/            # Unit tests (Vitest)
└── e2e/             # End-to-end tests (Playwright)
.gitignore
.eslintrc.js
biome.json
badges.yml
LICENSE
package.json
pnpm-lock.yaml
PROPOSED_README.md
README.md
tsconfig.json
vite.config.ts
AGENTS.md

</details>

## 📖 Table of Contents

-   [📝 Real-time AI Writing Assistant Browser Extension](#-real-time-ai-writing-assistant-browser-extension)
-   [🚀 Features](#-features)
-   [🧠 Architecture](#-architecture)
-   [📖 Table of Contents](#-table-of-contents)
-   [🤖 AI Agent Directives (System Instructions)](#-ai-agent-directives-system-instructions)
-   [🛠️ Development Standards](#️-development-standards)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Available Scripts](#available-scripts)
    -   [Coding Principles](#coding-principles)
-   [🤝 Contributing](#-contributing)
-   [📜 License](#-license)
-   [Security Policy](#security-policy)
-   [Code of Conduct](#code-of-conduct)
-   [Acknowledgements](#acknowledgements)

## 🤖 AI Agent Directives (System Instructions)

<details>
<summary>For Elite AI Agents & Collaborators: Click to Reveal Core Directives</summary>

# SYSTEM: APEX TECHNICAL AUTHORITY & ELITE ARCHITECT (DECEMBER 2025 EDITION)

## 1. IDENTITY & PRIME DIRECTIVE
**Role:** You are a Senior Principal Software Architect and Master Technical Copywriter with **40+ years of elite industry experience**. You operate with absolute precision, enforcing FAANG-level standards and the wisdom of "Managing the Unmanageable."
**Context:** Current Date is **December 2025**. You are building for the 2026 standard.
**Output Standard:** Deliver **EXECUTION-ONLY** results. No plans, no "reporting"—only executed code, updated docs, and applied fixes.
**Philosophy:** "Zero-Defect, High-Velocity, Future-Proof."

---

## 2. INPUT PROCESSING & COGNITION
*   **SPEECH-TO-TEXT INTERPRETATION PROTOCOL:**
    *   **Context:** User inputs may contain phonetic errors (homophones, typos).
    *   **Semantic Correction:** **STRICTLY FORBIDDEN** from executing literal typos. You must **INFER** technical intent based on the project context.
    *   **Logic Anchor:** Treat the `README.md` as the **Single Source of Truth (SSOT)**.
*   **MANDATORY MCP INSTRUMENTATION:**
    *   **No Guessing:** Do not hallucinate APIs.
    *   **Research First:** Use `linkup`/`brave` to search for **December 2025 Industry Standards**, **Security Threats**, and **2026 UI Trends**.
    *   **Validation:** Use `docfork` to verify *every* external API signature.
    *   **Reasoning:** Engage `clear-thought-two` to architect complex flows *before* writing code.

---

## 3. CONTEXT-AWARE APEX TECH STACKS (LATE 2025 STANDARDS)
**Directives:** Detect the project type and apply the corresponding **Apex Toolchain**. This repository, `GhostTyper-AI-Writing-Assistant-Browser-Extension`, is a TypeScript-based AI writing assistant browser extension.

*   **PRIMARY SCENARIO: WEB / APP / EXTENSION (TypeScript)**
    *   **Stack:** This project leverages **TypeScript 6.x (Strict)**, utilizing **WXT** for robust browser extension development (compatible with Chrome & Firefox), **Vite 7 (Rolldown)** for blazing-fast development and build processes, and potentially **Express.js** for any necessary backend API proxy or server-side AI integrations.
    *   **State Management:** Adheres to modern **Signals** patterns for efficient and reactive UI updates within the extension's popup and options pages.
    *   **AI Integration:** Deeply integrated with **Google Gemini API** (`gemini-3-pro` by default) for real-time, inline writing suggestions. Prioritize modular design, clear API contracts, robust error handling, and secure API key management for all AI model interactions.
    *   **Architecture:** Adheres to the **Feature-Sliced Design (FSD)** methodology, ensuring clear separation of concerns into layers (app, processes, pages, widgets, features, entities, shared) for scalability and maintainability.
    *   **Linting & Formatting:** Uses **Biome** for ultra-fast and comprehensive code linting and formatting, ensuring code quality and consistency.
    *   **Testing:** Employs **Vitest** for unit and integration testing of core logic and UI components, and **Playwright** for robust end-to-end testing across various browser environments, simulating user interactions effectively.

</details>

## 🛠️ Development Standards

### Prerequisites

Ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version)
*   [pnpm](https://pnpm.io/) (recommended package manager)
*   [Git](https://git-scm.com/)

### Installation

To get GhostTyper up and running for development, follow these steps:

1.  **Clone the Repository:**
    bash
    git clone https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension.git
    cd GhostTyper-AI-Writing-Assistant-Browser-Extension
    

2.  **Install Dependencies:**
    bash
    pnpm install
    

3.  **Configure API Keys:**
    Create a `.env` file in the project root based on `.env.example` and add your Google Gemini API key:
    
    VITE_GEMINI_API_KEY="your_google_gemini_api_key_here"
    

### Available Scripts

In the project directory, you can run:

| Script              | Description                                                          |
| :------------------ | :------------------------------------------------------------------- |
| `pnpm dev`          | Starts the development server with hot-reloading for extension.      |
| `pnpm build`        | Builds the extension for production to the `dist` folder.            |
| `pnpm lint`         | Runs Biome linter and formatter to check for code style issues.      |
| `pnpm lint:fix`     | Runs Biome linter and formatter, automatically fixing issues.        |
| `pnpm test`         | Runs unit and integration tests with Vitest.                         |
| `pnpm test:e2e`     | Runs end-to-end tests with Playwright.                               |
| `pnpm clean`        | Removes the `dist`, `node_modules`, and `pnpm-lock.yaml` files.      |

### Coding Principles

This project adheres to the following software development principles to ensure high quality, maintainability, and scalability:

*   **SOLID Principles:** Applied throughout the codebase for robust and flexible design.
*   **DRY (Don't Repeat Yourself):** Avoid redundant code to improve maintainability and reduce bugs.
*   **YAGNI (You Aren't Gonna Need It):** Focus on current requirements, avoiding premature optimization or feature creep.
*   **Feature-Sliced Design (FSD):** Enforces a clear, layered architecture for highly modular and scalable components.
*   **Test-Driven Development (TDD):** Writing tests before code for improved reliability and design.

## 🤝 Contributing

We welcome contributions to GhostTyper! Please see our [CONTRIBUTING.md](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/blob/main/.github/CONTRIBUTING.md) for guidelines on how to submit pull requests, report bugs, and suggest new features.

## 📜 License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International Public License (CC BY-NC 4.0). See the [LICENSE](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/blob/main/LICENSE) file for details.

## Security Policy

If you discover any security-related issues, please refer to our [SECURITY.md](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/blob/main/.github/SECURITY.md) for instructions on how to report them responsibly.

## Code of Conduct

We are committed to fostering a welcoming and inclusive community. Please read our [Code of Conduct](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/blob/main/.github/CODE_OF_CONDUCT.md) (coming soon) to understand the expected behavior within our project.

## Acknowledgements

*   Powered by [Google Gemini](https://ai.google.dev/).
*   Built with [WXT](https://wxt.dev/) for seamless browser extension development.
*   Testing facilitated by [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/).
*   Code quality ensured by [Biome](https://biomejs.dev/).
