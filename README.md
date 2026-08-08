# A11y Issue Finder (Website A11y Checker)

A Chrome Extension that scans any webpage for accessibility issues using the **axe-core** accessibility engine.

---

## Features

- Scan the current webpage
- Detect accessibility violations
- Display:
  - Violations
  - Passes
  - Incomplete checks
  - Inapplicable checks
- Show detected accessibility issues with severity and affected element counts
- Filter issues by severity
- Export scan results as JSON
- Clean and responsive popup UI
- Keyboard-accessible popup controls with visible focus states

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Chrome Extension API
- axe-core

---

## Project Structure

```text
A11Y-ISSUE-FINDER/
├── lib/
│   └── axe.min.js
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── README.md
```

---

## How to Run

1. Download or clone the repository.
2. Open Chrome.
3. Go to:

   ```text
   chrome://extensions
   ```

4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the project folder.
7. Open any website.
8. Click **Scan Website**.

---

## Permissions

This extension uses:

- `activeTab` to scan the currently open page when you click the extension.
- Content script matching on `<all_urls>` so axe-core can run on pages where extensions are allowed.

The extension keeps permissions minimal:
- no `host_permissions` entry
- no `scripting` permission
- no background processing requirement

> Note: Chrome restricts extensions on internal pages like `chrome://*` and other protected URLs.

---

## Current Progress

### Day 1
- Chrome extension setup
- Popup created
- Content script communication

### Day 2
- Integrated axe-core
- Accessibility scan working

### Day 3
- Popup UI improved
- Accessibility summary displayed
- Top issues displayed
- Tested on multiple websites
- Stable MVP completed

---

## Future Improvements

- Better severity badges
- Affected elements count
- More detailed accessibility report
- Better UI/UX
- Add screenshots and sample output to the README

---

## Notes

- This project is a good MVP for learning and demo purposes.
- Some accessibility results may vary depending on the website scanned.

---

## Author

Adarsh Priya Kashyap
Software Engineer Intern
