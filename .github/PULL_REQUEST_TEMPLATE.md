--- 
name: 🚀 Feature / 🐛 Bug Fix / 🛠 Refactor
about: Submit a pull request to enhance or fix GhostTyper.
title: "[TYPE]: Concise, actionable description of changes (e.g., [FEAT]: Implement Tab-to-Accept logic)"
labels: ['needs-review', 'status: waiting for review']
assignees: 'chirag127'
---

## ⚡️ Summary of Changes

Describe the changes introduced in this Pull Request. Focus on *what* was changed and *why*.

### Linked Issue (Required)
Fixes # (If this PR resolves an open issue, link it here.)
Related to # (If this PR is part of a larger effort or relates to another issue.)

---

## 🎯 Type of Change

Please mark the applicable changes with an `[x]`.

- [ ] 🚀 New feature (Non-breaking change that adds functionality)
- [ ] 🐛 Bug fix (Non-breaking change that fixes an issue)
- [ ] 🧹 Code Refactor (Improvement or cleanup without changing public behavior)
- [ ] 🚨 Security Fix (Addresses a vulnerability or strengthens defenses)
- [ ] 📚 Documentation Update (Changes to README, internal docs, or comments)
- [ ] 🧪 Testing (Adding or modifying existing tests)
- [ ] ⚙️ Configuration Change (CI/CD, build tools, dependency updates)

---

## ✅ Technical Checklist (FAANG Standard)

Ensure the following critical checks have been completed before requesting review.

### Code Quality & Standards
- [ ] My code follows the **Apex Technical Authority** standards and architectural principles (e.g., clean separation of concerns for content scripts, background worker, and popup UI).
- [ ] I have run the formatting and linting scripts locally and resolved all warnings/errors.
- [ ] My changes pass the established linting and type checks (`npm run lint:strict` / `npm run typecheck`).
- [ ] I have optimized logic for performance, especially in high-frequency content script loops that interact with the DOM.

### Testing & Verification
- [ ] I have added comprehensive unit tests (`Vitest`) or integration tests (`Playwright`) that cover the new or changed functionality.
- [ ] All existing tests pass successfully.
- [ ] I have manually tested the extension across supported browsers (Chrome, Firefox) and confirmed functionality on multiple domains.
- [ ] **[AI/API Check]** I have validated rate limit handling, robust error logging, and clear timeout strategies for all Google Gemini API calls.

### Documentation & Release
- [ ] If this PR introduces a new public API or setting, I have updated the `README.md` and/or internal developer documentation.
- [ ] I have updated the `CHANGELOG.md` (or prepared a draft entry) if this change is user-facing or breaks compatibility.
- [ ] Environment variables (if any) are documented and correctly handled using secure methods (e.g., Extension storage or GitHub Secrets).

---

## 🔍 Reviewer Focus Areas

Please direct the reviewer's attention to specific aspects of this change:

1.  **Content Script Efficiency:** Are there any performance bottlenecks introduced in the content scripts (e.g., DOM mutation observers, input field listeners)?
2.  **State Management:** Verify extension state management (e.g., `chrome.storage.local` and message passing) is clean, asynchronous, and reliable across all components.
3.  **Security:** Check for XSS vectors, improper handling of user input, or insecure storage of sensitive configuration (like API keys, which should remain background/service worker restricted).
4.  **User Experience (UX):** Ensure the inline suggestion UI (if modified) is non-intrusive, follows modern design principles, and adheres to accessibility standards (ARIA attributes).

---

## 🖼 Screenshots / Visuals (If applicable)

Provide screenshots or a GIF demonstrating the functionality before and after the change (especially for UI/UX updates).

*Before:*

*After:*

---

## ⚠️ Known Limitations or Risks

List any known issues, potential regressions, or architectural trade-offs made in this PR.

*   *(e.g., This change relies on a specific CSS selector structure that might be brittle on certain websites.)*