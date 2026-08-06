document.getElementById("scanBtn").addEventListener("click", async () => {

    // Get active tab
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    // Send message to content script
    chrome.tabs.sendMessage(
        tab.id,
        { action: "scan" },

        (response) => {

            console.log("Response:", response);

            if (!response) {
                document.getElementById("result").innerHTML = `
                    <p style="color:red;">
                        Failed to scan the current webpage.
                    </p>
                `;
                return;
            }

            // Build Top 3 Issues
            let issuesHTML = "";

            if (response.issues && response.issues.length > 0) {

                response.issues.forEach((issue, index) => {

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

                <p>❌ <b>Violations:</b> ${response.violations}</p>

                <p>✅ <b>Passes:</b> ${response.passes}</p>

                <p>⚠️ <b>Incomplete:</b> ${response.incomplete}</p>

                <p>📋 <b>Inapplicable:</b> ${response.inapplicable}</p>

                
               <hr>

                <h4>Accessibility Issues (${response.issues.length})</h4>

                

                ${issuesHTML}

            `;

        }

    );

});