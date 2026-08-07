let scanResults = null;
document.getElementById("scanBtn").addEventListener("click", async () => {
  // Get active tab
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  // Send message to content script
  chrome.tabs.sendMessage(
    tab.id,
    { action: "scan" },

    (response) => {
      scanResults = response;

      console.log("Response:", response);

      console.log("Response:", response);

      if (!response) {
        document.getElementById("result").innerHTML = `
                    <p style="color:red;">
                        Failed to scan the current webpage.
                    </p>
                `;
        return;
      }

      // Severity Counts
      let criticalCount = 0;
      let seriousCount = 0;
      let moderateCount = 0;
      let minorCount = 0;

      response.issues.forEach((issue) => {
        switch (issue.impact) {
          case "critical":
            criticalCount++;
            break;

          case "serious":
            seriousCount++;
            break;

          case "moderate":
            moderateCount++;
            break;

          case "minor":
            minorCount++;
            break;
        }
      });
      // Build Top 3 Issues
      let issuesHTML = "";
      const selectedSeverity = document.getElementById("severityFilter").value;

      const filteredIssues =
        selectedSeverity === "all"
          ? response.issues
          : response.issues.filter(
              (issue) =>
                issue.impact && issue.impact.toLowerCase() === selectedSeverity,
            );

      if (filteredIssues.length > 0) {
        filteredIssues.forEach((issue, index) => {
          // Format impact text
          const impact = issue.impact
            ? issue.impact.charAt(0).toUpperCase() + issue.impact.slice(1)
            : "Unknown";

          // Badge class
          const badgeClass = issue.impact
            ? issue.impact.toLowerCase()
            : "unknown";

          issuesHTML += `
                        <div class="issue">

                            <div class="issue-title">
                                ${index + 1}. ${issue.help}
                            </div>

                            <div style="margin:10px 0;">

                                <strong>Impact:</strong>

                                <span class="badge ${badgeClass}">
                                    ${impact}
                                </span>

                                <br><br>

                                <strong>Affected Elements:</strong>
                                ${issue.nodes.length}

                            </div>

                            <div class="issue-description">
                                ${issue.description}
                            </div>

                            <div style="margin-top:12px;">

                                <a href="${issue.helpUrl}"
                                   target="_blank"
                                   style="
                                        text-decoration:none;
                                        color:#2563eb;
                                        font-weight:bold;
                                   ">
                                    📘 Learn More
                                </a>

                            </div>

                        </div>
                    `;
        });
      } else {
        issuesHTML = `
                    <div class="issue">

                        <div class="issue-title">
                            🎉 No Accessibility Issues Found
                        </div>

                        <div class="issue-description">
                            Great! This page passed all accessibility checks.
                        </div>

                    </div>
                `;
      }

      // Update Popup UI
      document.getElementById("result").innerHTML = `

                <h3>Accessibility Report</h3>

                <div class="summary-grid">

    <div class="summary-card violations">

        <div class="summary-icon">❌</div>

        <div class="summary-number">
            ${response.violations}
        </div>

        <div class="summary-label">
            Violations
        </div>

    </div>

    <div class="summary-card passes">

        <div class="summary-icon">✅</div>

        <div class="summary-number">
            ${response.passes}
        </div>

        <div class="summary-label">
            Passes
        </div>

    </div>

   <div class="summary-card incomplete">
        <div class="summary-icon">⚠️</div>

        <div class="summary-number">
            ${response.incomplete}
        </div>

        <div class="summary-label">
            Incomplete
        </div>

    </div>

   <div class="summary-card inapplicable">

        <div class="summary-icon">📋</div>

        <div class="summary-number">
            ${response.inapplicable}
        </div>

        <div class="summary-label">
            Inapplicable
        </div>

    </div>

</div>
           <h4>Severity Breakdown</h4>

<div class="severity-grid">

<div class="severity-card critical">

🔴

<div class="severity-count">

${criticalCount}

</div>

<div class="severity-title">

Critical

</div>

</div>

<div class="severity-card serious">

🟠

<div class="severity-count">

${seriousCount}

</div>

<div class="severity-title">

Serious

</div>

</div>

<div class="severity-card moderate">

🟡

<div class="severity-count">

${moderateCount}

</div>

<div class="severity-title">

Moderate

</div>

</div>

<div class="severity-card minor">

🔵

<div class="severity-count">

${minorCount}

</div>

<div class="severity-title">

Minor

</div>

</div>

</div>

   
</div>
                
               <hr>

               <h4>Accessibility Issues (${filteredIssues.length})</h4>

                

                ${issuesHTML}

            `;
    },
  );
});

document.getElementById("severityFilter").addEventListener("change", () => {
  document.getElementById("scanBtn").click();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  if (!scanResults) {
    alert("Please scan a website first.");

    return;
  }

  // 👇 EVENT START
  const report = {
    website: scanResults.url,

    scanTime: new Date().toLocaleString(),

    summary: {
      violations: scanResults.violations,

      passes: scanResults.passes,

      incomplete: scanResults.incomplete,

      inapplicable: scanResults.inapplicable,
    },

    issues: scanResults.issues,
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
