// Shopify A/B Test Snippet using PostHog Feature Flags
// This script shows/hides elements based on CSS IDs for different test variations.

// Configuration:
// 1. Replace '**FEATURE FLAG KEY**' with your PostHog feature flag key.
// 2. Define your variations in `variationElements`.
//    - `control`: Array of CSS IDs for elements unique to the control group. Can be empty.
//    - `test_group_1`, `test_group_2`, etc.: Arrays of CSS IDs for elements unique to each test group.
//      These keys (e.g., 'test_group_1') MUST match the variant keys in your PostHog feature flag.
const testSlug = "**FEATURE FLAG KEY**";

const variationElements = {
  control: [/* "**CONTROL_ELEMENT_ID_1**", "**CONTROL_ELEMENT_ID_2**" */], // Elements to show ONLY for control
  test_group_1: ["**TG1_CSS_ID_1**", "**TG1_CSS_ID_2**"],                 // Elements to show ONLY for test_group_1
  test_group_2: ["**TG2_CSS_ID_1**" /*, "**TG2_CSS_ID_2**" */]            // Elements to show ONLY for test_group_2
  // Add more test groups as needed.
};

// Utility function to change the display style of an element.
// Note: It uses `document.querySelector("[id$='" + elementId + "']")` which matches IDs ENDING WITH elementId.
// This might be specific to a theme structure. If you need exact ID matching, change to `document.getElementById(elementId)`
// or `document.querySelector("#" + elementId)`.
const changeElementDisplay = (elementId, displayStyle) => {
  // Attempt to find element by ID ending with, then by exact ID if not found by suffix.
  let element = document.querySelector(`[id$='${elementId}']`);
  if (!element) {
    element = document.getElementById(elementId);
  }

  if (element) {
    element.style.display = displayStyle;
  } else {
    console.warn(`PostHog A/B Test: Element with ID ending in or exactly matching "${elementId}" not found.`);
  }
};

// Applies the visibility rules for the determined test group.
// It hides all elements defined in any variation first, then shows only those for the active group.
const applyVariation = (activeGroupKey) => {
  if (!variationElements.hasOwnProperty(activeGroupKey)) {
    console.warn(`PostHog A/B Test: Active group "${activeGroupKey}" is not defined in variationElements. Defaulting to control.`);
    activeGroupKey = 'control'; // Fallback to control if the active group is not defined
    if (!variationElements.hasOwnProperty(activeGroupKey)) {
        console.error(`PostHog A/B Test: Control group is not defined in variationElements. Cannot apply A/B test.`);
        return;
    }
  }

  // Hide all elements from all defined variations initially.
  Object.keys(variationElements).forEach(groupKey => {
    variationElements[groupKey].forEach(elementId => {
      changeElementDisplay(elementId, "none");
    });
  });

  // Show elements for the active group.
  variationElements[activeGroupKey].forEach(elementId => {
    changeElementDisplay(elementId, "block"); // Or "flex", "inline-block", etc., as appropriate for your layout.
                                            // Consider making this configurable if needed.
  });

  console.log(`PostHog A/B Test: Variation "${activeGroupKey}" applied.`);
};

// Retrieves a URL query parameter by its key.
const getQueryParamByKey = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

// Determines and applies the A/B test variation.
const evaluateTestGroup = () => {
  try {
    // Check for URL override for QA (e.g., ?my_test_slug=test_group_1)
    let forcedVariant = getQueryParamByKey(testSlug);

    if (forcedVariant && variationElements.hasOwnProperty(forcedVariant)) {
      console.log(`PostHog A/B Test: Forcing variation "${forcedVariant}" via URL parameter.`);
      applyVariation(forcedVariant);
      // Optionally, capture an event that a forced variant was used.
      // if (typeof posthog !== 'undefined') posthog.capture('$experiment_group_forced', { test_slug: testSlug, variant: forcedVariant });
    } else {
      // Wait for PostHog feature flags
      if (typeof posthog === 'undefined' || !posthog.onFeatureFlags) {
        console.warn('PostHog A/B Test: PostHog SDK not fully loaded or onFeatureFlags is not available. Defaulting to control.');
        applyVariation('control');
        return;
      }

      posthog.onFeatureFlags(() => {
        const flagValue = posthog.getFeatureFlag(testSlug);
        if (flagValue && variationElements.hasOwnProperty(flagValue)) {
          applyVariation(flagValue);
        } else {
          console.log(`PostHog A/B Test: Feature flag "${testSlug}" is not active or returned an undefined group ("${flagValue}"). Applying 'control'.`);
          applyVariation('control');
        }
      });
    }
  } catch (error) {
    console.error("PostHog A/B Test: Error during evaluation. Applying 'control'.", error);
    applyVariation('control'); // Fallback to control in case of any error
  }
};

// Initialize the A/B test evaluation.
// Ensure this script runs after the PostHog SDK has been initialized.
if (typeof posthog !== 'undefined' && posthog.getFeatureFlag) {
    evaluateTestGroup();
} else {
    console.warn('PostHog A/B Test: PostHog SDK not found or not ready. Attempting to run when PostHog is available.');
    let attempts = 0;
    const maxAttempts = 10;
    const intervalTime = 500; // ms
    const phInterval = setInterval(() => {
        attempts++;
        if (typeof posthog !== 'undefined' && posthog.getFeatureFlag) {
            clearInterval(phInterval);
            evaluateTestGroup();
        } else if (attempts >= maxAttempts) {
            clearInterval(phInterval);
            console.error('PostHog A/B Test: PostHog SDK did not become available. Test cannot run. Applying control.');
            applyVariation('control');
        }
    }, intervalTime);
}
