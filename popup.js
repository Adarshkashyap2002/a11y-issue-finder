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

function getWcagCriteria(issue) {
    const tags = Array.isArray(issue?.tags) ? issue.tags : [];
    const wcagTag = tags.find((tag) => /^wcag\d{3,4}$/i.test(tag));

    if (!wcagTag) return null;

    const normalized = wcagTag.toLowerCase();
    const match = normalized.match(/^wcag(\d)(\d)(\d+)$/);

    if (!match) return null;

    return `${match[1]}.${match[2]}.${match[3]}`;
}

function getWcagLevel(issue) {
    const tags = Array.isArray(issue?.tags)
        ? issue.tags.map((tag) => tag.toLowerCase())
        : [];

    if (tags.includes("wcag2aaa")) return "AAA";
    if (tags.includes("wcag2aa")) return "AA";
    if (tags.includes("wcag2a")) return "A";

    return null;
}

function getRemediation(issue) {

    const issueId = issue?.id?.toLowerCase();

    const remediationMap = {

        "color-contrast":
            "Increase the contrast between the foreground and background colors to meet the required WCAG contrast ratio.",

        "heading-order":
            "Use heading levels in a logical order. Avoid skipping heading levels unnecessarily.",

        "label":
            "Provide a clear and programmatically associated label for the form control.",

        "button-name":
            "Provide the button with a clear accessible name that describes its purpose.",

        "link-name":
            "Provide the link with a clear accessible name that describes its destination or purpose.",

        "image-alt":
            "Provide an appropriate alternative text for the image. Use an empty alt attribute when the image is purely decorative.",

        "html-has-lang":
            "Add a valid lang attribute to the HTML element to identify the language of the page.",

        "document-title":
            "Add a descriptive and meaningful title to the webpage.",

        "duplicate-id":
            "Ensure that every id attribute on the page is unique.",

        "aria-allowed-attr":
            "Remove unsupported ARIA attributes or use ARIA attributes that are valid for the element's role.",

        "aria-roles":
            "Use a valid ARIA role that is appropriate for the element.",

        "aria-valid-attr":
            "Use valid ARIA attributes and correct any invalid ARIA attribute names.",

        "form-field-multiple-labels":
            "Ensure that the form control does not have multiple conflicting labels."

    };

    return (
        remediationMap[issueId] ||
        "Review the issue details and axe-core documentation to determine the appropriate accessibility fix."
    );
}



function getSeverityCounts(issues) {
    const counts = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
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
        ["inapplicable", "📋", "Inapplicable", getCount(response.inapplicable)]
    ];

    cards.forEach(([cardClass, icon, label, value]) => {
        const card = createElement("div", `summary-card ${cardClass}`);
        card.append(
            createElement("div", "summary-icon", icon),
            createElement("div", "summary-number", String(value)),
            createElement("div", "summary-label", label)
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
        ["minor", "🔵", "Minor", counts.minor]
    ];

    cards.forEach(([cardClass, icon, title, value]) => {
        const card = createElement("div", `severity-card ${cardClass}`);
        card.append(
            document.createTextNode(icon),
            createElement("div", "severity-count", String(value)),
            createElement("div", "severity-title", title)
        );
        severityGrid.appendChild(card);
    });

    parent.appendChild(severityGrid);
}

/* =========================================================
   HIGHLIGHT ACCESSIBILITY ELEMENT
   ========================================================= */
function highlightElement(targets) {
    if (!Array.isArray(targets) || targets.length === 0) {
        alert("No affected element selector is available for this issue.");
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];

        if (!tab?.id) {
            alert("Unable to access the current webpage.");
            return;
        }

        chrome.tabs.sendMessage(
            tab.id,
            { action: "highlight", target: targets },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Highlight error:", chrome.runtime.lastError.message);
                    alert("Unable to highlight the element. Please reload the webpage and try again.");
                    return;
                }

                if (!response) {
                    alert("No response received from the webpage.");
                    return;
                }

                if (!response.success) {
                    alert(response.message || "Affected element could not be found.");
                    return;
                }

                console.log("Element highlighted successfully.");
            }
        );
    });
}

/* =========================================================
   CREATE ISSUE CARD
   ========================================================= */
function createIssueCard(issue, index) {
    const impact = getImpactValue(issue);
    const impactLabel = impact.charAt(0).toUpperCase() + impact.slice(1);
    const issueTitle = issue?.help || "Accessibility issue";
    const issueDescription = issue?.description || "No description provided.";
    const affectedNodes = Array.isArray(issue?.nodes) ? issue.nodes.length : 0;

    const issueCard = createElement("div", "issue");
    const remediation = getRemediation(issue);

    // WCAG Badges
    const wcagCriteria = getWcagCriteria(issue);
    const wcagLevel = getWcagLevel(issue);

    if (wcagCriteria || wcagLevel) {
        const wcagInfo = createElement("div", "issue-wcag");

        if (wcagCriteria) {
            wcagInfo.appendChild(createElement("span", "wcag-criteria", `WCAG ${wcagCriteria}`));
        }
        if (wcagLevel) {
            wcagInfo.appendChild(createElement("span", "wcag-level", `Level ${wcagLevel}`));
        }

        issueCard.appendChild(wcagInfo);
    }

    // Issue Title
    issueCard.appendChild(createElement("div", "issue-title", `${index + 1}. ${issueTitle}`));

    // Issue Meta Details
    const details = createElement("div", "issue-meta");
    details.appendChild(createElement("strong", null, "Impact:"));
    details.appendChild(createElement("span", `badge ${impact}`, impactLabel));
    details.appendChild(createElement("br"));
    details.appendChild(createElement("br"));
    details.appendChild(createElement("strong", null, "Affected Elements:"));
    details.appendChild(document.createTextNode(` ${affectedNodes}`));

    issueCard.appendChild(details);

    // Issue Description
    issueCard.appendChild(createElement("div", "issue-description", issueDescription));
    const remediationBox =
    createElement("div", "remediation-box");

remediationBox.appendChild(
    createElement(
        "div",
        "remediation-title",
        "💡 How to Fix"
    )
);

remediationBox.appendChild(
    createElement(
        "div",
        "remediation-text",
        remediation
    )
);

issueCard.appendChild(remediationBox);

    // Highlight Element Button
    if (Array.isArray(issue?.nodes) && issue.nodes.length > 0) {
        const highlightWrapper = createElement("div", "issue-highlight-wrapper");
        const highlightButton = createElement("button", "highlight-element-btn", "🔎 Highlight Element");
        highlightButton.type = "button";

        highlightButton.addEventListener("click", () => {
            const firstNode = issue.nodes[0];
            const targets = firstNode?.target;
            highlightElement(targets);
        });

        highlightWrapper.appendChild(highlightButton);
        issueCard.appendChild(highlightWrapper);
    }

    // Learn More Link
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

/* =========================================================
   RENDER RESULTS
   ========================================================= */
function renderResults(response) {
    const issues = Array.isArray(response.issues) ? response.issues : [];
    const selectedSeverity = severityFilter.value;

    const filteredIssues = selectedSeverity === "all"
        ? issues
        : issues.filter((issue) => getImpactValue(issue) === selectedSeverity);

    const counts = getSeverityCounts(issues);

    resultContainer.replaceChildren();

    // Report Title & Cards
    resultContainer.appendChild(createElement("h3", null, "Accessibility Report"));
    appendSummaryCards(resultContainer, response);

    // Severity Breakdown
    resultContainer.appendChild(createElement("h4", null, "Severity Breakdown"));
    appendSeverityCards(resultContainer, counts);

    resultContainer.appendChild(createElement("hr"));

    // Issue Count
    resultContainer.appendChild(
        createElement("h4", null, `Accessibility Issues (${filteredIssues.length})`)
    );

    // No Issues State
    if (filteredIssues.length === 0) {
        const emptyCard = createElement("div", "issue");
        emptyCard.append(
            createElement("div", "issue-title", "🎉 No Accessibility Issues Found"),
            createElement("div", "issue-description", "Great! This page passed all accessibility checks.")
        );
        resultContainer.appendChild(emptyCard);
        return;
    }

    // Render Issues List
    filteredIssues.forEach((issue, index) => {
        resultContainer.appendChild(createIssueCard(issue, index));
    });
}

/* =========================================================
   ERROR DISPLAY
   ========================================================= */
function renderError(message) {
    resultContainer.replaceChildren();
    resultContainer.appendChild(createElement("p", "error-text", message));
}

/* =========================================================
   SEND SCAN MESSAGE
   ========================================================= */
function sendScanMessage(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(
            tabId,
            { action: "scan" },
            (response) => {
                if (chrome.runtime.lastError) {
                    resolve({ error: chrome.runtime.lastError.message });
                    return;
                }
                resolve(response);
            }
        );
    });
}

/* =========================================================
   EVENT LISTENERS
   ========================================================= */
scanBtn.addEventListener("click", async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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
            pageTitle: response.pageTitle || tab.title || ""
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

    const report = {
        website: scanResults.url || "",
        scanTime: new Date().toLocaleString(),
        summary: {
            violations: scanResults.violations,
            passes: scanResults.passes,
            incomplete: scanResults.incomplete,
            inapplicable: scanResults.inapplicable
        },
        issues: Array.isArray(scanResults.issues) ? scanResults.issues : []
    };

    const json = JSON.stringify(report, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "accessibility-report.json";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
});