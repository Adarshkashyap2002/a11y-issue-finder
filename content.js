chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log("Message Received");

    if (message.action === "scan") {

        console.log("Before axe.run");

        axe.run(document).then((results) => {

            console.log("After axe.run");

            // Summary Object
            const summary = {

                violations: results.violations.length,
                passes: results.passes.length,
                incomplete: results.incomplete.length,
                inapplicable: results.inapplicable.length,

                // Send complete violations list to popup
                issues: results.violations

            };

            console.log(summary);

            // Send data back to popup.js
            sendResponse(summary);

        }).catch((err) => {

            console.error("AXE ERROR:", err);

            sendResponse({
                error: err.message
            });

        });

        // Required because sendResponse is called asynchronously
        return true;
    }

});