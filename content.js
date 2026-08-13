chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message Received:", message);

  // =========================================================
  // ACCESSIBILITY SCAN
  // =========================================================

  if (message.action === "scan") {
    console.log("Before axe.run");

    axe
      .run(document)
      .then((results) => {
        console.log("After axe.run");

        // Summary Object

        const summary = {
          violations: results.violations.length,
          passes: results.passes.length,
          incomplete: results.incomplete.length,
          inapplicable: results.inapplicable.length,

          // Send complete violations list to popup
          issues: results.violations,
        };

        console.log("Accessibility Summary:", summary);

        // Send data back to popup.js
        sendResponse(summary);
      })
      .catch((err) => {
        console.error("AXE ERROR:", err);

        sendResponse({
          error: err.message,
        });
      });

    // Required because sendResponse is called asynchronously
    return true;
  }

  // =========================================================
  // HIGHLIGHT ACCESSIBILITY ELEMENT
  // =========================================================

  if (message.action === "highlight") {
    console.log("Highlight request received");

    const targets = message.target;

    // Validate target
    if (!targets || !Array.isArray(targets) || targets.length === 0) {
      console.error("No valid target selector received.");

      sendResponse({
        success: false,
        message: "No valid target selector provided.",
      });

      return true;
    }

    let element = null;

    // Try each selector returned by axe-core
    for (const selector of targets) {
      try {
        element = document.querySelector(selector);

        if (element) {
          break;
        }
      } catch (error) {
        console.warn("Invalid selector:", selector, error);
      }
    }

    // Element not found
    if (!element) {
      console.error("Accessibility element not found:", targets);

      sendResponse({
        success: false,
        message: "Affected element could not be found on the current page.",
      });

      return true;
    }

    // =====================================================
    // REMOVE PREVIOUS HIGHLIGHT
    // =====================================================

    const previousHighlight = document.querySelector(".a11y-highlight");

    if (previousHighlight) {
      previousHighlight.classList.remove("a11y-highlight");
    }

    // =====================================================
    // ADD HIGHLIGHT STYLE
    // =====================================================

    element.classList.add("a11y-highlight");

    // =====================================================
    // SCROLL TO ELEMENT
    // =====================================================

    element.scrollIntoView({
      behavior: "smooth",

      block: "center",

      inline: "center",
    });

    // =====================================================
    // CREATE HIGHLIGHT STYLE
    // =====================================================

    let styleElement = document.getElementById("a11y-highlight-style");

    if (!styleElement) {
      styleElement = document.createElement("style");

      styleElement.id = "a11y-highlight-style";

      styleElement.textContent = `

                .a11y-highlight {

    outline: 4px solid #ef4444 !important;

    outline-offset: 4px !important;

    box-shadow:
        0 0 0 6px rgba(239, 68, 68, 0.25) !important;

}
            `;

      document.head.appendChild(styleElement);
    }

    // =====================================================
    // REMOVE HIGHLIGHT AFTER 5 SECONDS
    // =====================================================

    setTimeout(() => {
      if (element) {
        element.classList.remove("a11y-highlight");
      }
    }, 5000);

    console.log("Accessibility element highlighted:", element);

    sendResponse({
      success: true,

      message: "Accessibility element highlighted successfully.",
    });

    return true;
  }
});
