const scanBtn = document.getElementById("scanBtn");
const exportBtn = document.getElementById("exportBtn");
const severityFilter = document.getElementById("severityFilter");
const resultContainer = document.getElementById("result");

let scanResults = null;

const IMPACT_LEVELS = ["critical", "serious", "moderate", "minor"];

function getCount(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0;
}

function getImpactValue(issue) {
  const impact = issue?.impact?.toLowerCase();
  return IMPACT_LEVELS.includes(impact) ? impact : "unknown";
}

function isSafeHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function getSeverityCounts(issues) {
  const counts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };

  issues.forEach((issue) => {
    const impact = getImpactValue(issue);
    if (impact in counts) {
      counts[impact] += 1;
    }
  });

  return counts;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (typeof text === "string") {
    element.textContent = text;
  }
  return element;
}

function appendSummaryCards(parent, response) {
  const summaryGrid = createElement("div", "summary-grid");
  const cards = [
    ["violations", "❌", "Violations", getCount(response.violations)],
    ["passes", "✅", "Passes", getCount(response.passes)],
    ["incomplete", "⚠️", "Incomplete", getCount(response.incomplete)],
    ["inapplicable", "📋", "Inapplicable", getCount(response.inapplicable)],
  ];

  cards.forEach(([cardClass, icon, label, value]) => {
    const card = createElement("div", `summary-card ${cardClass}`);
    card.append(
      createElement("div", "summary-icon", icon),
      createElement("div", "summary-number", String(value)),
      createElement("div", "summary-label", label),
    );
    summaryGrid.appendChild(card);
  });

  parent.appendChild(summaryGrid);
}

function appendSeverityCards(parent, counts) {
  const severityGrid = createElement("div", "severity-grid");
  const cards = [
    ["critical", "🔴", "Critical", counts.critical],
    ["serious", "🟠", "Serious", counts.serious],
    ["moderate", "🟡", "Moderate", counts.moderate],
    ["minor", "🔵", "Minor", counts.minor],
  ];

  cards.forEach(([cardClass, icon, title, value]) => {
    const card = createElement("div", `severity-card ${cardClass}`);
    card.append(
      document.createTextNode(icon),
      createElement("div", "severity-count", String(value)),
      createElement("div", "severity-title", title),
    );
    severityGrid.appendChild(card);
  });

  parent.appendChild(severityGrid);
}

function createIssueCard(issue, index) {
  const impact = getImpactValue(issue);
  const impactLabel = impact.charAt(0).toUpperCase() + impact.slice(1);
  const issueTitle = issue?.help || "Accessibility issue";
  const issueDescription = issue?.description || "No description provided.";
  const affectedNodes = Array.isArray(issue?.nodes) ? issue.nodes.length : 0;

  const issueCard = createElement("div", "issue");
  issueCard.appendChild(createElement("div", "issue-title", `${index + 1}. ${issueTitle}`));

  const details = createElement("div", "issue-meta");
  details.appendChild(createElement("strong", null, "Impact:"));
  details.appendChild(createElement("span", `badge ${impact}`, impactLabel));
  details.appendChild(createElement("br"));
  details.appendChild(createElement("br"));
  details.appendChild(createElement("strong", null, "Affected Elements:"));
  details.appendChild(document.createTextNode(` ${affectedNodes}`));
  issueCard.appendChild(details);

  issueCard.appendChild(createElement("div", "issue-description", issueDescription));

  const learnMoreWrapper = createElement("div", "issue-learn-more");
  const link = createElement("a", "learn-more-link", "📘 Learn More");
  if (isSafeHttpUrl(issue?.helpUrl)) {
    link.href = issue.helpUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
    link.tabIndex = -1;
  }
  learnMoreWrapper.appendChild(link);
  issueCard.appendChild(learnMoreWrapper);

  return issueCard;
}

function renderResults(response) {
  const issues = Array.isArray(response.issues) ? response.issues : [];
  const selectedSeverity = severityFilter.value;
  const filteredIssues =
    selectedSeverity === "all"
      ? issues
      : issues.filter((issue) => getImpactValue(issue) === selectedSeverity);

  const counts = getSeverityCounts(issues);

  resultContainer.replaceChildren();
  resultContainer.appendChild(createElement("h3", null, "Accessibility Report"));
  appendSummaryCards(resultContainer, response);
  resultContainer.appendChild(createElement("h4", null, "Severity Breakdown"));
  appendSeverityCards(resultContainer, counts);
  resultContainer.appendChild(createElement("hr"));
  resultContainer.appendChild(
    createElement("h4", null, `Accessibility Issues (${filteredIssues.length})`),
  );

  if (filteredIssues.length === 0) {
    const emptyCard = createElement("div", "issue");
    emptyCard.append(
      createElement("div", "issue-title", "🎉 No Accessibility Issues Found"),
      createElement(
        "div",
        "issue-description",
        "Great! This page passed all accessibility checks.",
      ),
    );
    resultContainer.appendChild(emptyCard);
    return;
  }

  filteredIssues.forEach((issue, index) => {
    resultContainer.appendChild(createIssueCard(issue, index));
  });
}

function renderError(message) {
  resultContainer.replaceChildren();
  resultContainer.appendChild(createElement("p", "error-text", message));
}

function sendScanMessage(tabId) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { action: "scan" }, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ error: chrome.runtime.lastError.message });
        return;
      }
      resolve(response);
    });
  });
}

scanBtn.addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      renderError("No active tab available for scanning.");
      return;
    }

    const response = await sendScanMessage(tab.id);

    if (!response) {
      renderError("Failed to scan the current webpage.");
      return;
    }

    if (response.error) {
      renderError(response.error);
      return;
    }

    const issues = Array.isArray(response.issues) ? response.issues : [];

    scanResults = {
      ...response,
      issues,
      url: response.url || tab.url || "",
      pageTitle: response.pageTitle || tab.title || "",
    };

    renderResults(scanResults);
  } catch (error) {
    renderError(error?.message || "Unexpected error while scanning.");
  }
});

severityFilter.addEventListener("change", () => {
  if (scanResults) {
    renderResults(scanResults);
    return;
  }
  scanBtn.click();
});

exportBtn.addEventListener("click", () => {
  if (!scanResults) {
    alert("Please scan a website first.");

    return;
  }

  // 👇 EVENT START
  const report = {
    website: scanResults.url || "",

    scanTime: new Date().toLocaleString(),

    summary: {
      violations: scanResults.violations,

      passes: scanResults.passes,

      incomplete: scanResults.incomplete,

      inapplicable: scanResults.inapplicable,
    },

    issues: Array.isArray(scanResults.issues) ? scanResults.issues : [],
  };
  const json = JSON.stringify(report, null, 4);
  const blob = new Blob([json], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "accessibility-report.json";

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
});
