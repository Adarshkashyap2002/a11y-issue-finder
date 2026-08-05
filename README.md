# Website A11y Checker

A Chrome Extension that scans any webpage for accessibility issues using the **axe-core** accessibility engine.

---

## Features

- Scan the current webpage
- Detect accessibility violations
- Display:
  - Violations
  - Passes
  - Incomplete Checks
  - Inapplicable Checks
- Show Top 3 Accessibility Issues
- Clean and responsive popup UI

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Chrome Extension API
- axe-core

---

## Project Structure

```
A11Y-ISSUE-FINDER/

│── icons/
│── lib/
│   └── axe.min.js
│── manifest.json
│── popup.html
│── popup.js
│── content.js
```

---

## How to Run

1. Download or Clone the repository.
2. Open Chrome.
3. Go to:

```
chrome://extensions
```

4. Enable **Developer Mode**.
5. Click **Load Unpacked**.
6. Select the project folder.
7. Open any website.
8. Click **Scan Website**.

---

## Current Progress

### Day 1
- Chrome Extension setup
- Popup created
- Content Script communication

### Day 2
- Integrated axe-core
- Accessibility scan working

### Day 3
- Popup UI improved
- Accessibility summary displayed
- Top 3 issues displayed
- Tested on multiple websites
- Stable MVP completed

---

## Future Improvements

- Severity badges
- Affected elements count
- Export report
- Detailed accessibility report
- Better UI/UX

---

## Author

Adarsh Priya Kashyap
Software Engineer Intern
