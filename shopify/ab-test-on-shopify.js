/**
 * PostHog A/B Test Snippet for Shopify
 *
 * This script enables A/B testing on Shopify stores by dynamically showing or hiding
 * elements based on PostHog feature flags or URL parameters.
 *
 * How it works:
 * 1. Define your variation elements (CSS IDs) and the PostHog feature flag key.
 * 2. The script checks for a URL parameter matching the feature flag key.
 * 3. If no URL parameter is found, it waits for PostHog feature flags to load.
 * 4. Based on the flag value or URL parameter, it shows elements for the active
 *    variant and hides others.
 * 5. If the flag isn't set or an error occurs, it defaults to showing 'control' elements.
 *
 * Instructions:
 * - Update `variationElements` with the CSS IDs of your test variations.
 *   The key 'control' is mandatory for the default experience. Other keys
 *   (e.g., 'test_group_1') should match your feature flag's variants.
 * - Set `testSlug` to your PostHog feature flag key.
 */

// START USER CONFIGURATION
// =============================================================================

// Define the CSS IDs for elements in each variation.
// - 'control': Elements visible in the control group (original experience).
// - Other keys (e.g., 'test_group_1', 'variant_b'): Elements for your test variations.
//   These keys should match the variant keys defined in your PostHog feature flag.
const variationElements = {
  control: [], // Example: ["original-hero-banner", "original-cta-button"]
  test_group_1: ["**TG1_CSS_ID**"], // Example: ["new-hero-banner", "new-cta-button"]
  // Add more test groups as needed, e.g.:
  // test_group_2: ["**TG2_CSS_ID**"]
};

// Set this to the key of your feature flag in PostHog.
const testSlug = "**FEATURE_FLAG_KEY**";

// =============================================================================
// END USER CONFIGURATION
// (No need to modify code below this line)

/**
 * Changes the display style of an element.
 * @param {string} elementId - The ID of the element to modify.
 * @param {string} displayNew - The new display value (e.g., 'block', 'none').
 */
const changeElementDisplay = (elementId, displayNew) => {
  // Shopify themes sometimes append unique IDs, so we use a selector
  // that matches if the elementId is at the end of the actual ID.
  const element = document.querySelector("[id$='" + elementId + "']");
  if (element) {
    element.style.display = displayNew;
    console.log("PostHog A/B Test: Element '" + elementId + "' display set to '" + displayNew + "'.");
  } else {
    console.warn("PostHog A/B Test: Element with ID ending in '" + elementId + "' not found.");
  }
};

/**
 * Applies the correct visibility to all elements based on the determined active group.
 * It ensures that an element is visible if it's part of any active variant group,
 * and hidden otherwise.
 * @param {string} groupValue - The active test group (e.g., 'control', 'test_group_1').
 */
const applyVariantsVisibility = (groupValue) => {
  const allElementIds = new Set();
  Object.values(variationElements).forEach(ids => ids.forEach(id => allElementIds.add(id)));

  allElementIds.forEach(elementId => {
    let elementShouldBeVisible = false;
    if (variationElements[groupValue] && variationElements[groupValue].includes(elementId)) {
      elementShouldBeVisible = true;
    }
    changeElementDisplay(elementId, elementShouldBeVisible ? "block" : "none");
  });

  console.log("PostHog A/B Test: Group '" + groupValue + "' activated.");
};

/**
 * Retrieves a URL query parameter by its key.
 * @param {string} key - The key of the query parameter.
 * @returns {string|null} The value of the query parameter or null if not found.
 */
const getQueryParamByKey = (key) =>
  new URLSearchParams(window.location.search).get(key);

/**
 * Determines the active test group from URL parameters or PostHog feature flags
 * and applies the visibility rules.
 * @param {object} variationElements - The configuration object for variations.
 * @param {string} testSlug - The feature flag key.
 */
const evaluateTestGroup = (variationElements, testSlug) => {
  try {
    let groupValue = getQueryParamByKey(testSlug);

    if (groupValue && variationElements.hasOwnProperty(groupValue)) {
      console.log("PostHog A/B Test: Forcing group '" + groupValue + "' from URL parameter.");
      applyVariantsVisibility(groupValue);
    } else {
      if (typeof posthog === 'undefined' || typeof posthog.onFeatureFlags !== 'function') {
        console.warn("PostHog A/B Test: PostHog SDK not found or onFeatureFlags is not available. Defaulting to control.");
        applyVariantsVisibility('control');
        return;
      }
      // Wait for PostHog feature flags to be loaded
      posthog.onFeatureFlags(() => {
        const flagValue = posthog.getFeatureFlag(testSlug);
        if (variationElements.hasOwnProperty(flagValue)) {
          console.log("PostHog A/B Test: Applying group '" + flagValue + "' from feature flag.");
          applyVariantsVisibility(flagValue);
        } else {
          // Default to 'control' if the flag value isn't a configured variant or is undefined/false
          console.log("PostHog A/B Test: Feature flag '" + testSlug + "' not set or variant '" + flagValue + "' not configured. Defaulting to control.");
          applyVariantsVisibility('control');
        }
      });
    }
  } catch (error) {
    console.error("PostHog A/B Test: Error evaluating test group. Defaulting to control.", error);
    applyVariantsVisibility('control');
  }
};

// Initialize the A/B test evaluation.
evaluateTestGroup(variationElements, testSlug);
