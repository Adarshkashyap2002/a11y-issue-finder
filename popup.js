const scanBtn = document.getElementById("scanBtn");
const exportBtn = document.getElementById("exportBtn");
const severityFilter = document.getElementById("severityFilter");
const resultContainer = document.getElementById("result");

let scanResults = null;

const IMPACT_LEVELS = [
    "critical",
    "serious",
    "moderate",
    "minor"
];

function getCount(value) {

    return Number.isFinite(Number(value))
        ? Number(value)
        : 0;

}

function getImpactValue(issue) {

    const impact = issue?.impact?.toLowerCase();

    return IMPACT_LEVELS.includes(impact)
        ? impact
        : "unknown";

}

function isSafeHttpUrl(url) {

    try {

        const parsed = new URL(url);

        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );

    } catch (error) {

        return false;

    }

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

    const summaryGrid =
        createElement("div", "summary-grid");

    const cards = [

        [
            "violations",
            "❌",
            "Violations",
            getCount(response.violations)
        ],

        [
            "passes",
            "✅",
            "Passes",
            getCount(response.passes)
        ],

        [
            "incomplete",
            "⚠️",
            "Incomplete",
            getCount(response.incomplete)
        ],

        [
            "inapplicable",
            "📋",
            "Inapplicable",
            getCount(response.inapplicable)
        ]

    ];

    cards.forEach(
        ([cardClass, icon, label, value]) => {

            const card =
                createElement(
                    "div",
                    `summary-card ${cardClass}`
                );

            card.append(

                createElement(
                    "div",
                    "summary-icon",
                    icon
                ),

                createElement(
                    "div",
                    "summary-number",
                    String(value)
                ),

                createElement(
                    "div",
                    "summary-label",
                    label
                )

            );

            summaryGrid.appendChild(card);

        }
    );

    parent.appendChild(summaryGrid);

}

function appendSeverityCards(parent, counts) {

    const severityGrid =
        createElement("div", "severity-grid");

    const cards = [

        [
            "critical",
            "🔴",
            "Critical",
            counts.critical
        ],

        [
            "serious",
            "🟠",
            "Serious",
            counts.serious
        ],

        [
            "moderate",
            "🟡",
            "Moderate",
            counts.moderate
        ],

        [
            "minor",
            "🔵",
            "Minor",
            counts.minor
        ]

    ];

    cards.forEach(
        ([cardClass, icon, title, value]) => {

            const card =
                createElement(
                    "div",
                    `severity-card ${cardClass}`
                );

            card.append(

                document.createTextNode(icon),

                createElement(
                    "div",
                    "severity-count",
                    String(value)
                ),

                createElement(
                    "div",
                    "severity-title",
                    title
                )

            );

            severityGrid.appendChild(card);

        }
    );

    parent.appendChild(severityGrid);

}


/*
=========================================================
HIGHLIGHT ACCESSIBILITY ELEMENT
=========================================================
*/

function highlightElement(targets) {

    if (
        !Array.isArray(targets) ||
        targets.length === 0
    ) {

        alert(
            "No affected element selector is available for this issue."
        );

        return;

    }

    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        (tabs) => {

            const tab = tabs[0];

            if (!tab?.id) {

                alert(
                    "Unable to access the current webpage."
                );

                return;

            }

            chrome.tabs.sendMessage(
                tab.id,
                {
                    action: "highlight",
                    target: targets
                },
                (response) => {

                    if (chrome.runtime.lastError) {

                        console.error(
                            "Highlight error:",
                            chrome.runtime.lastError.message
                        );

                        alert(
                            "Unable to highlight the element. Please reload the webpage and try again."
                        );

                        return;

                    }

                    if (!response) {

                        alert(
                            "No response received from the webpage."
                        );

                        return;

                    }

                    if (!response.success) {

                        alert(
                            response.message ||
                            "Affected element could not be found."
                        );

                        return;

                    }

                    console.log(
                        "Element highlighted successfully."
                    );

                }
            );

        }
    );

}


/*
=========================================================
CREATE ISSUE CARD
=========================================================
*/

function createIssueCard(issue, index) {

    const impact =
        getImpactValue(issue);

    const impactLabel =
        impact.charAt(0).toUpperCase() +
        impact.slice(1);

    const issueTitle =
        issue?.help ||
        "Accessibility issue";

    const issueDescription =
        issue?.description ||
        "No description provided.";

    const affectedNodes =
        Array.isArray(issue?.nodes)
            ? issue.nodes.length
            : 0;

    const issueCard =
        createElement(
            "div",
            "issue"
        );


    /*
    ---------------------------------------------------------
    ISSUE TITLE
    ---------------------------------------------------------
    */

    issueCard.appendChild(

        createElement(
            "div",
            "issue-title",
            `${index + 1}. ${issueTitle}`
        )

    );


    /*
    ---------------------------------------------------------
    ISSUE META
    ---------------------------------------------------------
    */

    const details =
        createElement(
            "div",
            "issue-meta"
        );

    details.appendChild(

        createElement(
            "strong",
            null,
            "Impact:"
        )

    );

    details.appendChild(

        createElement(
            "span",
            `badge ${impact}`,
            impactLabel
        )

    );

    details.appendChild(

        createElement(
            "br"
        )

    );

    details.appendChild(

        createElement(
            "br"
        )

    );

    details.appendChild(

        createElement(
            "strong",
            null,
            "Affected Elements:"
        )

    );

    details.appendChild(

        document.createTextNode(
            ` ${affectedNodes}`
        )

    );

    issueCard.appendChild(details);


    /*
    ---------------------------------------------------------
    ISSUE DESCRIPTION
    ---------------------------------------------------------
    */

    issueCard.appendChild(

        createElement(
            "div",
            "issue-description",
            issueDescription
        )

    );


    /*
    ---------------------------------------------------------
    HIGHLIGHT ELEMENT BUTTON
    ---------------------------------------------------------
    */

    if (
        Array.isArray(issue?.nodes) &&
        issue.nodes.length > 0
    ) {

        const highlightWrapper =
            createElement(
                "div",
                "issue-highlight-wrapper"
            );

        const highlightButton =
            createElement(
                "button",
                "highlight-element-btn",
                "🔎 Highlight Element"
            );

        highlightButton.type = "button";

        highlightButton.addEventListener(
            "click",
            () => {

                /*
                Use the first affected node.

                axe-core can return multiple nodes
                for a single accessibility issue.
                */

                const firstNode =
                    issue.nodes[0];

                const targets =
                    firstNode?.target;

                highlightElement(targets);

            }
        );

        highlightWrapper.appendChild(
            highlightButton
        );

        issueCard.appendChild(
            highlightWrapper
        );

    }


    /*
    ---------------------------------------------------------
    LEARN MORE
    ---------------------------------------------------------
    */

    const learnMoreWrapper =
        createElement(
            "div",
            "issue-learn-more"
        );

    const link =
        createElement(
            "a",
            "learn-more-link",
            "📘 Learn More"
        );

    if (
        isSafeHttpUrl(
            issue?.helpUrl
        )
    ) {

        link.href =
            issue.helpUrl;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

    } else {

        link.href =
            "#";

        link.setAttribute(
            "aria-disabled",
            "true"
        );

        link.tabIndex =
            -1;

    }

    learnMoreWrapper.appendChild(
        link
    );

    issueCard.appendChild(
        learnMoreWrapper
    );


    return issueCard;

}


/*
=========================================================
RENDER RESULTS
=========================================================
*/

function renderResults(response) {

    const issues =
        Array.isArray(response.issues)
            ? response.issues
            : [];

    const selectedSeverity =
        severityFilter.value;

    const filteredIssues =
        selectedSeverity === "all"
            ? issues
            : issues.filter(
                (issue) =>
                    getImpactValue(issue) ===
                    selectedSeverity
            );

    const counts =
        getSeverityCounts(issues);


    resultContainer.replaceChildren();


    /*
    ---------------------------------------------------------
    REPORT TITLE
    ---------------------------------------------------------
    */

    resultContainer.appendChild(

        createElement(
            "h3",
            null,
            "Accessibility Report"
        )

    );


    /*
    ---------------------------------------------------------
    SUMMARY CARDS
    ---------------------------------------------------------
    */

    appendSummaryCards(
        resultContainer,
        response
    );


    /*
    ---------------------------------------------------------
    SEVERITY BREAKDOWN
    ---------------------------------------------------------
    */

    resultContainer.appendChild(

        createElement(
            "h4",
            null,
            "Severity Breakdown"
        )

    );

    appendSeverityCards(
        resultContainer,
        counts
    );


    /*
    ---------------------------------------------------------
    SEPARATOR
    ---------------------------------------------------------
    */

    resultContainer.appendChild(
        createElement("hr")
    );


    /*
    ---------------------------------------------------------
    ISSUE COUNT
    ---------------------------------------------------------
    */

    resultContainer.appendChild(

        createElement(
            "h4",
            null,
            `Accessibility Issues (${filteredIssues.length})`
        )

    );


    /*
    ---------------------------------------------------------
    NO ISSUES
    ---------------------------------------------------------
    */

    if (
        filteredIssues.length === 0
    ) {

        const emptyCard =
            createElement(
                "div",
                "issue"
            );

        emptyCard.append(

            createElement(
                "div",
                "issue-title",
                "🎉 No Accessibility Issues Found"
            ),

            createElement(
                "div",
                "issue-description",
                "Great! This page passed all accessibility checks."
            )

        );

        resultContainer.appendChild(
            emptyCard
        );

        return;

    }


    /*
    ---------------------------------------------------------
    RENDER ISSUES
    ---------------------------------------------------------
    */

    filteredIssues.forEach(
        (issue, index) => {

            resultContainer.appendChild(

                createIssueCard(
                    issue,
                    index
                )

            );

        }
    );

}


/*
=========================================================
ERROR DISPLAY
=========================================================
*/

function renderError(message) {

    resultContainer.replaceChildren();

    resultContainer.appendChild(

        createElement(
            "p",
            "error-text",
            message
        )

    );

}


/*
=========================================================
SEND SCAN MESSAGE
=========================================================
*/

function sendScanMessage(tabId) {

    return new Promise(
        (resolve) => {

            chrome.tabs.sendMessage(
                tabId,
                {
                    action: "scan"
                },
                (response) => {

                    if (
                        chrome.runtime.lastError
                    ) {

                        resolve({

                            error:
                                chrome.runtime
                                    .lastError
                                    .message

                        });

                        return;

                    }

                    resolve(response);

                }
            );

        }
    );

}


/*
=========================================================
SCAN BUTTON
=========================================================
*/

scanBtn.addEventListener(
    "click",
    async () => {

        try {

            const [tab] =
                await chrome.tabs.query(
                    {
                        active: true,
                        currentWindow: true
                    }
                );


            if (!tab?.id) {

                renderError(
                    "No active tab available for scanning."
                );

                return;

            }


            const response =
                await sendScanMessage(
                    tab.id
                );


            if (!response) {

                renderError(
                    "Failed to scan the current webpage."
                );

                return;

            }


            if (response.error) {

                renderError(
                    response.error
                );

                return;

            }


            const issues =
                Array.isArray(
                    response.issues
                )
                    ? response.issues
                    : [];


            scanResults = {

                ...response,

                issues,

                url:
                    response.url ||
                    tab.url ||
                    "",

                pageTitle:
                    response.pageTitle ||
                    tab.title ||
                    ""

            };


            renderResults(
                scanResults
            );


        } catch (error) {

            renderError(

                error?.message ||
                "Unexpected error while scanning."

            );

        }

    }
);


/*
=========================================================
SEVERITY FILTER
=========================================================
*/

severityFilter.addEventListener(
    "change",
    () => {

        if (scanResults) {

            renderResults(
                scanResults
            );

            return;

        }

        scanBtn.click();

    }
);


/*
=========================================================
EXPORT JSON
=========================================================
*/

exportBtn.addEventListener(
    "click",
    () => {

        if (!scanResults) {

            alert(
                "Please scan a website first."
            );

            return;

        }


        const report = {

            website:
                scanResults.url ||
                "",

            scanTime:
                new Date()
                    .toLocaleString(),

            summary: {

                violations:
                    scanResults.violations,

                passes:
                    scanResults.passes,

                incomplete:
                    scanResults.incomplete,

                inapplicable:
                    scanResults.inapplicable

            },

            issues:
                Array.isArray(
                    scanResults.issues
                )
                    ? scanResults.issues
                    : []

        };


        const json =
            JSON.stringify(
                report,
                null,
                4
            );


        const blob =
            new Blob(
                [json],
                {
                    type:
                        "application/json"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const a =
            document.createElement(
                "a"
            );


        a.href =
            url;

        a.download =
            "accessibility-report.json";


        document.body.appendChild(
            a
        );


        a.click();


        document.body.removeChild(
            a
        );


        URL.revokeObjectURL(
            url
        );

    }
);