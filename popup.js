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

                response.issues.slice(0, 3).forEach((issue, index) => {

                    issuesHTML += `
                        <div class="issue">

                            <div class="issue-title">
                                ${index + 1}. ${issue.help}
                            </div>

                            <div class="issue-description">
                                ${issue.description}
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

            document.getElementById("result").innerHTML = `

                <h3>Accessibility Report</h3>

                <p>❌ <b>Violations:</b> ${response.violations}</p>

                <p>✅ <b>Passes:</b> ${response.passes}</p>

                <p>⚠️ <b>Incomplete:</b> ${response.incomplete}</p>

                <p>📋 <b>Inapplicable:</b> ${response.inapplicable}</p>

                <hr>

                <h4>Top 3 Issues</h4>

                ${issuesHTML}

            `;

        }

    );

});