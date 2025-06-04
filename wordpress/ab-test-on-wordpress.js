/**
 * PostHog A/B Test Snippet for WordPress (and other JS environments)
 *
 * This script enables A/B testing by dynamically applying CSS changes to elements
 * based on PostHog feature flags or URL parameters.
 *
 * How it works:
 * 1. Define `variations`: an object where keys are variant names (e.g., 'control', 'test_group_1').
 *    Each variant contains an array of objects, each specifying a CSS `selector`
 *    and an `updates` object detailing the CSS properties to change.
 * 2. Set `testSlug` to your PostHog feature flag key.
 * 3. The script checks for a URL parameter matching the feature flag key.
 * 4. If no URL parameter, it waits for PostHog feature flags.
 * 5. Based on the flag or URL param, it applies the defined CSS updates for the active variant.
 * 6. Defaults to 'control' if the flag isn't set, value is unrecognized, or an error occurs.
 *
 * Instructions:
 * - Update `variations`:
 *   - 'control' key is mandatory for the default/original experience.
 *   - Other keys (e.g., 'test_group_1') should match your feature flag's variants.
 *   - `selector`: Any valid CSS selector (e.g., '#my-id', '.my-class', 'article h1').
 *   - `updates`: An object defining what to change. For styles, use `style: { property: 'value' }`.
 *     Example: `updates: { style: { display: 'none', backgroundColor: 'blue' }, innerText: 'New Text' }`
 * - Set `testSlug` to your PostHog feature flag key.
 */

// START USER CONFIGURATION
// =============================================================================
const testSlug = '**FEATURE_FLAG_KEY**'; // Your PostHog feature flag key

const variations = {
  'control': [ // Configuration for the 'control' group (original experience)
    // Example: { selector: '#new-feature-banner', updates: { style: { display: 'none' } } },
    //          { selector: '#original-banner', updates: { style: { display: 'block' } } }
  ],
  'test_group_1': [ // Configuration for 'test_group_1'
    // Example: Make control items invisible
    // { selector: '**CONTROL_CSS_SELECTOR_HERE**', updates: { style: { display: 'none' } } },
    // Example: Make test group 1 items visible
    // { selector: '**TG1_CSS_SELECTOR_HERE**', updates: { style: { display: 'block' } } }
    // Example: Change text of an element
    // { selector: '#hero-title', updates: { innerText: 'Welcome to the New Experience!' } },
    // Example: Change background color
    // { selector: '.main-cta-button', updates: { style: { backgroundColor: 'red' } } }
  ]
  // Add more variations as needed, e.g., 'test_group_2': [ ... ]
};
// =============================================================================
// END USER CONFIGURATION

/**
 * Applies specified updates to elements matching the selector.
 * @param {string} selector - CSS selector for target elements.
 * @param {object} updates - Object defining attributes/styles to change.
 */
const applyUpdates = (selector, updates) => {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) {
    console.warn(`PostHog A/B Test: No elements found for selector '${selector}'.`);
    return;
  }
  elements.forEach((element) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          element.style[styleKey] = styleValue;
        });
      } else {
        // For other properties like innerText, className, etc.
        try {
          element[key] = value;
        } catch (e) {
          console.error(`PostHog A/B Test: Error setting property '${key}' on selector '${selector}'.`, e);
        }
      }
    });
  });
};

/**
 * Applies the configuration for a specific variant.
 * @param {string} variantKey - The key of the variant to apply (e.g., 'control', 'test_group_1').
 */
const applyVariantConfig = (variantKey) => {
  if (!variations[variantKey]) {
    console.warn(`PostHog A/B Test: Variant key '${variantKey}' not found in configurations. Applying 'control'.`);
    variantKey = 'control'; // Fallback to control
  }

  // First, apply the 'control' configuration to reset elements if needed,
  // unless the target variant is 'control' itself. This helps in switching between variants.
  // However, a more robust reset might involve defining explicit "reset" states or hiding all variant elements first.
  // For simplicity here, we just apply the target variant's settings.
  // Consider a strategy where all elements managed by the test are first hidden, then the active ones shown.

  const config = variations[variantKey];
  if (config) {
    config.forEach(({ selector, updates }) => {
      applyUpdates(selector, updates);
    });
    console.log(`PostHog A/B Test: Group "${variantKey}" activated.`);
  } else {
    // This should ideally not be reached if fallback to 'control' is effective
    console.error(`PostHog A/B Test: No configuration found for variant '${variantKey}', even after fallback.`);
  }
};

/**
 * Retrieves a URL query parameter by its key.
 * @param {string} key - The key of the query parameter.
 * @returns {string|null} The value of the query parameter or null if not found.
 */
const getQueryParamByKey = (key) => new URLSearchParams(window.location.search).get(key);

/**
 * Determines and applies visibility/changes for variants based on URL parameter or feature flag.
 */
const evaluateTestGroup = () => {
  try {
    let groupValueQueryParam = getQueryParamByKey(testSlug);

    if (groupValueQueryParam && variations.hasOwnProperty(groupValueQueryParam)) {
      console.log(`PostHog A/B Test: Forcing group '${groupValueQueryParam}' from URL parameter.`);
      applyVariantConfig(groupValueQueryParam);
    } else {
      if (typeof posthog === 'undefined' || typeof posthog.onFeatureFlags !== 'function') {
        console.warn("PostHog A/B Test: PostHog SDK not found or onFeatureFlags not available. Applying 'control'.");
        applyVariantConfig('control');
        return;
      }
      posthog.onFeatureFlags(() => {
        const flagValue = posthog.getFeatureFlag(testSlug);
        if (variations.hasOwnProperty(flagValue)) {
          console.log(`PostHog A/B Test: Applying group '${flagValue}' from feature flag.`);
          applyVariantConfig(flagValue);
        } else {
          console.log(`PostHog A/B Test: Feature flag '${testSlug}' not set or variant '${flagValue}' not recognized. Applying 'control'.`);
          applyVariantConfig('control'); // Default to 'control'
        }
      });
    }
  } catch (error) {
    console.error("PostHog A/B Test: Error evaluating test group. Applying 'control'.", error);
    applyVariantConfig('control');
  }
};

// Initialize the A/B test evaluation.
evaluateTestGroup();
