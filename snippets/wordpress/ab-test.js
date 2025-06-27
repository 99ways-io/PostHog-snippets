// Variation definition
const testSlug = '**FEATURE FLAG KEY**'; // Replace with your PostHog Feature Flag Key

const variations = {
  'control': [], // ALWAYS keep the control key as 'control'. This array can be empty if control shows default content.
                 // If you need to explicitly define elements for control (e.g. ensure specific elements are visible), add them here.
  'test_group_1': [ // Define your first test variation
    {
      selector: '**CONTROL_CSS_ID**', // CSS selector for an element to hide/modify from control version
      updates: {style: {display: 'none'}} // Example: hide an element
    },
    {
      selector: '**TG1_CSS_ID**', // CSS selector for an element specific to this variation
      updates: {style: {display: 'block'}} // Example: show an element for this variation
    }
    // Add more selectors and updates for test_group_1 as needed
  ],
  'test_group_2': [ // Define your second test variation (optional)
    {
      selector: '**CONTROL_CSS_ID**',
      updates: {style: {display: 'none'}}
    },
    {
      selector: '**TG2_CSS_ID**',
      updates: {style: {display: 'block'}}
    }
    // Add more selectors and updates for test_group_2 as needed
  ]
  // Add more test groups (e.g., 'test_group_3') as needed, following the same structure.
};

// Utility function to apply updates (like style changes, innerHTML, etc.) to selected elements.
const applyUpdates = (selector, updates) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        // Apply multiple style properties
        Object.entries(value).forEach(([styleKey, styleValue]) => {
          element.style[styleKey] = styleValue;
        });
      } else if (typeof element[key] === 'function') {
        // Call method if key is a function name (e.g. element.setAttribute('href', value))
        // This requires 'value' to be an array of arguments or a single argument.
        // For simplicity, this example assumes direct property assignment or style.
        // For more complex interactions like setAttribute, extend this part.
        console.warn(`Applying update as a function call for ${key} is not directly supported in this basic version. Consider direct property assignment or extending this function.`);
      } else {
        // Direct property assignment (e.g., element.innerHTML = value, element.href = value)
        element[key] = value;
      }
    });
  });
};

// Applies all defined updates for a specific variant configuration.
const applyVariantConfig = (variantKey) => {
  if (!variations[variantKey]) {
    console.error(`Variation "${variantKey}" not found in configurations.`);
    return;
  }
  const config = variations[variantKey];
  config.forEach(({ selector, updates }) => {
    applyUpdates(selector, updates);
  });
  console.log(`PostHog A/B Test: Variation "${variantKey}" applied.`);
};

// Retrieves a URL query parameter by its key.
const getQueryParamByKey = (key) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
};

// Determines and applies the A/B test variation.
// It first checks for a URL parameter to force a variation (useful for QA).
// If not found, it waits for PostHog feature flags to load and applies the variation from PostHog.
const evaluateTestGroup = (currentVariations, currentTestSlug) => {
  // Check for URL override (e.g., ?my_test_slug=test_group_1)
  let forcedVariant = getQueryParamByKey(currentTestSlug);

  if (forcedVariant && currentVariations.hasOwnProperty(forcedVariant)) {
    console.log(`PostHog A/B Test: Forcing variation "${forcedVariant}" via URL parameter.`);
    applyVariantConfig(forcedVariant);
    // Optionally, you might want to send an event to PostHog that a forced variant was applied
    // posthog.capture('$experiment_group_forced', { test_slug: currentTestSlug, variant: forcedVariant });
  } else {
    // Wait for PostHog feature flags
    if (typeof posthog === 'undefined' || !posthog.onFeatureFlags) {
        console.warn('PostHog SDK not fully loaded or onFeatureFlags is not available. A/B test may not run.');
        // Fallback or error handling: potentially show control or log an error
        // applyVariantConfig('control'); // Optionally default to control
        return;
    }
    posthog.onFeatureFlags(() => {
      const flagValue = posthog.getFeatureFlag(currentTestSlug);
      if (flagValue && currentVariations.hasOwnProperty(flagValue)) {
        applyVariantConfig(flagValue);
      } else {
        // Feature flag not set, not recognized, or returned 'false' (if 'false' is not a defined variant key)
        // Default to 'control' if the flag isn't active or doesn't match a defined variation.
        console.log(`PostHog A/B Test: Feature flag "${currentTestSlug}" is not active or returned an undefined group ("${flagValue}"). Applying 'control'.`);
        applyVariantConfig('control');
      }
    });
  }
};

// Initialize the A/B test evaluation.
// Ensure this script runs after the PostHog SDK has been initialized.
// If PostHog is loaded asynchronously, you might need to wrap this call,
// or ensure this script is placed after the PostHog init snippet.
if (typeof posthog !== 'undefined') {
    evaluateTestGroup(variations, testSlug);
} else {
    console.warn('PostHog SDK not found. A/B test evaluation skipped. Ensure PostHog is initialized before this script.');
    // Attempt to run when PostHog becomes available, with a timeout
    let attempts = 0;
    const maxAttempts = 10;
    const intervalTime = 500; // ms
    const phInterval = setInterval(() => {
        attempts++;
        if (typeof posthog !== 'undefined' && posthog.getFeatureFlag) { // Check for a specific PostHog function
            clearInterval(phInterval);
            evaluateTestGroup(variations, testSlug);
        } else if (attempts >= maxAttempts) {
            clearInterval(phInterval);
            console.error('PostHog SDK did not become available. A/B test cannot run.');
            // applyVariantConfig('control'); // Optionally default to control
        }
    }, intervalTime);
}
