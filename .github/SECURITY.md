# Security Policy

At **GhostTyper-AI-Writing-Assistant-Browser-Extension**, we prioritize the security of our users and our software. This document outlines our security policy, how to report vulnerabilities, and our commitment to maintaining a secure environment for this AI-powered browser extension.

## Reporting a Vulnerability

We appreciate the efforts of security researchers and the community in helping us maintain the security of GhostTyper. If you discover a security vulnerability, please report it to us promptly and responsibly.

**Please DO NOT open a public GitHub issue.** Publicly disclosing vulnerabilities can put users at risk.

### Preferred Method: GitHub Security Advisories

We encourage you to use GitHub's private vulnerability reporting feature:

1.  Navigate to the **Security** tab of the `chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension` repository on GitHub: [https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/security](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/security)
2.  Click on `Report a privately reported security vulnerability`.
3.  Provide a detailed description of the vulnerability, including steps to reproduce it, potential impact, and any suggested mitigations.

This method ensures that the vulnerability information is shared directly and securely with the project maintainers, allowing us to address it before public disclosure.

### Alternative Method: Direct Contact

If the GitHub Security Advisories feature is not suitable for your specific case, you may contact the primary maintainer privately via email. Please check the project's main README for contact information (typically a maintainer's email or a dedicated security email if available).

## Our Commitment to You

*   We commit to acknowledging receipt of your report within **3 business days**.
*   We will provide regular updates on the progress of the investigation and remediation.
*   We will notify you when the vulnerability has been patched and provide an estimated timeline for release.
*   We will publicly credit you for your responsible disclosure, if you wish, in our security advisory.

## Supported Versions

Only the latest major version of **GhostTyper-AI-Writing-Assistant-Browser-Extension** receives security updates. We strongly encourage all users to update to the latest available version to ensure they benefit from the most recent security patches and features.

| Version       | Supported          |
| :------------ | :----------------- |
| Latest Stable | :white_check_mark: |
| Older Versions| :x:                |

## Security Best Practices for Browser Extensions

As a browser extension, GhostTyper adheres to stringent security practices to protect user data and maintain browser integrity:

*   **Minimal Permissions:** We request only the permissions absolutely necessary for the extension's core functionality.
*   **Content Security Policy (CSP):** A strict CSP is enforced to mitigate cross-site scripting (XSS) and other content injection attacks.
*   **Input Validation & Sanitization:** All user inputs and API responses are thoroughly validated and sanitized to prevent malicious code execution or data corruption.
*   **Secure API Communication:** All communication with external APIs (e.g., Google Gemini API) is conducted over HTTPS with proper authentication and authorization.
*   **No `eval()` or Dangerous Functions:** We avoid the use of `eval()` or similar functions that can execute arbitrary strings as code.
*   **Dependency Scanning:** We regularly scan our dependencies for known vulnerabilities using automated tools.
*   **Code Review:** All code changes undergo rigorous peer review to identify potential security flaws.
*   **Data Protection:** Sensitive user data, if any, is handled with encryption and never transmitted unnecessarily.

Thank you for helping us keep GhostTyper-AI-Writing-Assistant-Browser-Extension secure.