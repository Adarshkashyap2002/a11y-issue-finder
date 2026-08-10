# 🌐 Website A11y Checker

A Chrome Extension that scans webpages for accessibility issues using **axe-core** and provides a clear, user-friendly accessibility report.

The extension helps identify accessibility violations, understand their severity, inspect affected elements, and export the complete scan report as JSON.

---

## 🚀 Features

- 🔍 Scan the current webpage for accessibility issues
- 📊 Accessibility summary dashboard
- ❌ Violations count
- ✅ Passes count
- ⚠️ Incomplete checks count
- 📋 Inapplicable checks count
- 🎯 Severity-based filtering
- 🔴 Critical, Serious, Moderate, and Minor impact classification
- 📈 Severity Breakdown
- 🧩 Display affected element count
- 📖 "Learn More" links to axe-core documentation
- 📥 Export complete accessibility reports as JSON
- 🌐 Export the scanned website URL
- 🕒 Include scan timestamp in exported reports
- 📱 Clean and responsive popup UI

---

## 🛠️ Tech Stack

- **JavaScript**
- **HTML5**
- **CSS3**
- **Chrome Extension APIs**
- **axe-core**

---

## 🧠 How It Works

The extension follows a simple workflow:

```text
User opens a webpage
        ↓
Clicks "Scan Website"
        ↓
Chrome Extension sends scan request
        ↓
axe-core analyzes the webpage
        ↓
Accessibility results are returned
        ↓
Results are displayed in the popup
        ↓
User can filter issues by severity
        ↓
User can inspect affected elements
        ↓
User can export the complete report as JSON
```

---

## 📊 Accessibility Report

The extension provides a summary of the accessibility scan:

| Metric | Description |
|---|---|
| ❌ Violations | Accessibility rules that failed |
| ✅ Passes | Rules that passed |
| ⚠️ Incomplete | Rules that require further manual review |
| 📋 Inapplicable | Rules that were not applicable to the page |

---

## 🎯 Severity Levels

Detected accessibility issues are categorized based on their impact:

- 🔴 **Critical**
- 🟠 **Serious**
- 🟡 **Moderate**
- 🔵 **Minor**

Users can filter the displayed issues using the severity filter.

---

## 📋 Issue Details

For each detected accessibility issue, the extension displays:

- Issue title
- Impact / severity
- Number of affected elements
- Description
- Link to the relevant axe-core documentation

---

## 📥 JSON Export

The extension allows users to export the complete accessibility scan as a JSON file.

The exported report includes:

- Scanned website URL
- Scan timestamp
- Accessibility summary
- Detected accessibility issues
- Issue IDs
- Impact levels
- Descriptions
- Help information
- axe-core documentation links
- Affected nodes and related scan data

### Example

```json
{
  "website": "https://example.com",
  "scanTime": "8/8/2026, 10:52:43 AM",
  "summary": {
    "violations": 7,
    "passes": 25,
    "incomplete": 0,
    "inapplicable": 61
  },
  "issues": []
}
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Adarshkashyap2002/a11y-issue-finder.git
```

### 2. Open Chrome Extensions

Open:

```text
chrome://extensions
```

### 3. Enable Developer Mode

Turn on **Developer mode**.

### 4. Load the Extension

Click:

```text
Load unpacked
```

Select the cloned project folder.

### 5. Start Scanning

Open any webpage, click the extension icon, and select:

```text
Scan Website
```

---

## 📁 Project Structure

```text
a11y-issue-finder/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── README.md
└── ...
```

---

## 🧪 Testing

The extension has been tested on multiple websites to verify:

- Accessibility scanning
- Issue detection
- Severity filtering
- Summary reporting
- Severity breakdown
- JSON export
- Documentation links
- Popup UI behavior

---

## 🔮 Future Improvements

Possible future enhancements include:

- WCAG conformance level display (A / AA / AAA)
- PDF report generation
- Historical scan reports
- Accessibility trend visualization
- Additional report customization

---

## 📌 Project Status

**Version:** 1.0

**Status:** Core accessibility scanning and reporting features implemented.

---

## 👨‍💻 Author

**Adarsh Kashyap**

Built as a Chrome Extension project focused on improving website accessibility testing and reporting.
