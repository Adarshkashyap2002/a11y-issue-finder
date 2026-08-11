<div align="center">

# 🌐 Website A11y Checker

### Accessibility Testing Chrome Extension

Scan webpages, detect accessibility issues, understand their severity, inspect affected elements, and export complete accessibility reports using **axe-core**.

<br>

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![axe-core](https://img.shields.io/badge/axe--core-4.x-6E56CF)
![Version](https://img.shields.io/badge/Version-1.0.1-success)

</div>

---

## 🚀 What is Website A11y Checker?

<table>
<tr>
<td width="50%">

### 🎯 Purpose

A lightweight Chrome Extension designed to help developers quickly identify and understand accessibility issues on webpages.

</td>
<td width="50%">

### ⚡ Powered By

**axe-core** performs the accessibility analysis and provides detailed rule violations, affected elements, WCAG information, and documentation links.

</td>
</tr>
</table>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔍 Accessibility Scanning

Scan the current webpage and detect accessibility violations using axe-core.

### 📊 Accessibility Dashboard

View violations, passes, incomplete checks, and inapplicable checks.

### 🎯 Severity Filtering

Filter detected issues by:

🔴 Critical  
🟠 Serious  
🟡 Moderate  
🔵 Minor

</td>

<td width="50%">

### ♿ WCAG Information

View WCAG criteria and conformance levels associated with detected issues.

### 🔦 Element Highlighting

Highlight affected elements directly on the webpage.

### 💡 How to Fix

View remediation guidance for detected accessibility issues.

### 📥 JSON Export

Export the complete accessibility scan report for further analysis or documentation.

</td>
</tr>
</table>

---

## 🖥️ Accessibility Report

<table>
<tr>
<td align="center">

### ❌ Violations

Accessibility rules that failed.

</td>
<td align="center">

### ✅ Passes

Accessibility rules that passed.

</td>
<td align="center">

### ⚠️ Incomplete

Rules requiring further review.

</td>
<td align="center">

### 📋 Inapplicable

Rules not applicable to the page.

</td>
</tr>
</table>

---

## 🎯 Issue Analysis

Every detected issue can provide:

<table>
<tr>
<td>

**WCAG Criterion**

Associated accessibility success criterion.

</td>
<td>

**Conformance Level**

A / AA / AAA when available.

</td>
<td>

**Impact**

Critical, Serious, Moderate, or Minor.

</td>
</tr>

<tr>
<td>

**Affected Elements**

Number of elements affected by the issue.

</td>
<td>

**How to Fix**

Basic remediation guidance.

</td>
<td>

**Learn More**

Link to the relevant axe-core documentation.

</td>
</tr>
</table>

---

## 🔦 Affected Element Highlighting

The extension can highlight the affected element directly on the webpage.

This allows developers to quickly locate the problematic element instead of manually searching through the page source or DOM.

```text
Accessibility Issue
        ↓
Affected Element
        ↓
Highlight Element
        ↓
Element identified directly on webpage

📥 JSON Report Export

The complete accessibility report can be exported as a JSON file.

Exported Data
<table> <tr> <td>🌐 Website URL</td> <td>🕒 Scan Timestamp</td> </tr> <tr> <td>📊 Accessibility Summary</td> <td>⚠️ Detected Issues</td> </tr> <tr> <td>🏷️ Issue IDs & Impact</td> <td>♿ WCAG Information</td> </tr> <tr> <td>🔗 Documentation URLs</td> <td>🧩 Affected Nodes</td> </tr> </table>
Example
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
🛠️ Tech Stack
<table> <tr> <td align="center"><b>JavaScript</b><br>Extension Logic</td> <td align="center"><b>HTML5</b><br>Popup Structure</td> <td align="center"><b>CSS3</b><br>User Interface</td> </tr> <tr> <td align="center"><b>Chrome APIs</b><br>Browser Integration</td> <td align="center"><b>axe-core</b><br>Accessibility Analysis</td> <td align="center"><b>Manifest V3</b><br>Extension Platform</td> </tr> </table>



🔄 How It Works

┌───────────────────────────────┐
│        Open Webpage           │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│       Click "Scan Website"    │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│       axe-core Analysis       │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│     Accessibility Results     │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│  Severity + WCAG Information  │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│ Highlight / Fix / Learn More  │
└───────────────┬───────────────┘
                ↓
┌───────────────────────────────┐
│        Export JSON Report     │
└───────────────────────────────┘


⚙️ Installation
<table> <tr> <td><b>01</b></td> <td>Clone the repository</td> </tr> <tr> <td><b>02</b></td> <td>Open <code>chrome://extensions</code></td> </tr> <tr> <td><b>03</b></td> <td>Enable <b>Developer Mode</b></td> </tr> <tr> <td><b>04</b></td> <td>Click <b>Load unpacked</b></td> </tr> <tr> <td><b>05</b></td> <td>Select the cloned project folder</td> </tr> <tr> <td><b>06</b></td> <td>Open a webpage and click <b>Scan Website</b></td> </tr> </table>



Clone
git clone https://github.com/Adarshkashyap2002/a11y-issue-finder.git



📁 Project Structure
a11y-issue-finder/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── lib/
│   └── axe.min.js
└── README.md

🧪 Tested Features
<table> <tr> <td>✅ Accessibility Scanning</td> <td>✅ Issue Detection</td> </tr> <tr> <td>✅ Severity Filtering</td> <td>✅ Severity Breakdown</td> </tr> <tr> <td>✅ WCAG Information</td> <td>✅ Element Highlighting</td> </tr> <tr> <td>✅ How to Fix Guidance</td> <td>✅ JSON Export</td> </tr> <tr> <td>✅ Documentation Links</td> <td>✅ Popup UI</td> </tr> </table>
🔮 Future Improvements
<table> <tr> <td>📄 PDF Reports</td> <td>📚 Scan History</td> </tr> <tr> <td>📈 Accessibility Trends</td> <td>🔄 Historical Comparison</td> </tr> <tr> <td>📊 Advanced Reporting</td> <td>🌐 Additional Standards</td> </tr> </table>
📌 Project Status
<div align="center">
🟢 Version 1.0.1

Core accessibility scanning and reporting features implemented.

The extension currently supports accessibility scanning, severity analysis, WCAG information, remediation guidance, affected-element highlighting, documentation links, and JSON report export.

</div>
👨‍💻 Author
<div align="center">
Adarsh Kashyap

Built as a Chrome Extension project focused on improving website accessibility testing and reporting.

</div> ```