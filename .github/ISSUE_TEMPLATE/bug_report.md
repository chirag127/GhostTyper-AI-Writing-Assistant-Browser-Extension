---
name: "🐞 Bug Report"
about: "Create a detailed report to help us identify and fix a bug in GhostTyper."
title: "[BUG] - "
labels: ["bug", "needs-triage"]
assignees: 'chirag127'

body:
  - type: markdown
    attributes:
      value: |
        **Thank you for helping improve GhostTyper!**

        Before submitting, please ensure this bug has not already been reported by searching our [existing issues](https://github.com/chirag127/GhostTyper-AI-Writing-Assistant-Browser-Extension/issues).

        Please provide as much detail as possible to help us reproduce and resolve the issue quickly.

  - type: textarea
    id: bug-description
    attributes:
      label: "Bug Description"
      description: "Provide a clear and concise description of what the bug is. What happened, and on what website/text field did it occur?"
      placeholder: "When I try to use the Tab-to-accept feature in the Gmail compose window, the suggestion disappears instead of being inserted."
    validations:
      required: true

  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: "Steps to Reproduce"
      description: "Detail the exact steps required to reproduce the behavior."
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Type '....'
        4. See error
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: "Expected Behavior"
      description: "A clear and concise description of what you expected to happen."
      placeholder: "I expected the AI-generated text to be inserted into the text field, replacing the placeholder."
    validations:
      required: true

  - type: textarea
    id: actual-behavior
    attributes:
      label: "Actual Behavior"
      description: "A clear and concise description of what actually happened."
      placeholder: "The placeholder text vanished, and nothing was inserted. The cursor remained in its original position."
    validations:
      required: true
  
  - type: textarea
    id: screenshots
    attributes:
      label: "Screenshots or Video"
      description: "If applicable, add screenshots, GIFs, or a short video to help explain your problem. This is often the most helpful part of a bug report!"
      placeholder: "You can drag and drop images or GIFs here."

  - type: dropdown
    id: browser
    attributes:
      label: "Browser"
      description: "Which browser are you using?"
      options:
        - Google Chrome
        - Mozilla Firefox
        - Other (Please specify in 'Additional Context')
    validations:
      required: true

  - type: input
    id: browser-version
    attributes:
      label: "Browser Version"
      description: "You can usually find this in 'About [Browser Name]'."
      placeholder: "e.g., Chrome 125.0.6422.113"
    validations:
      required: true

  - type: input
    id: extension-version
    attributes:
      label: "GhostTyper Version"
      description: "You can find this in your browser's extension management page."
      placeholder: "e.g., v1.2.0"
    validations:
      required: true

  - type: input
    id: os
    attributes:
      label: "Operating System"
      description: "What operating system are you using?"
      placeholder: "e.g., macOS 14.5, Windows 11, Ubuntu 22.04"
    validations:
      required: true

  - type: textarea
    id: console-logs
    attributes:
      label: "Console Logs"
      description: |
        Please open the browser's developer tools and check for any error messages in the console. For extensions, there are two important consoles:
        1. **The Page Console:** Right-click on the page where the bug occurs -> Inspect -> Console.
        2. **The Extension's Background Console:** Go to your browser's extension management page, find GhostTyper, and click the link for the 'service worker' or 'background page' to open its dedicated console.
        
        Paste any relevant logs here, especially red error messages.
      placeholder: "e.g., 'Error: [API_KEY_INVALID] Google API key is not valid...'"

  - type: textarea
    id: additional-context
    attributes:
      label: "Additional Context"
      description: "Add any other context about the problem here. For example, are you behind a corporate firewall? Are any other extensions conflicting?"
