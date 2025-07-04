// This script is designed to integrate Shopify store events with PostHog analytics.
// It listens to Shopify's standard customer events, processes their data, and sends it to PostHog.

// --- Helper Functions for Data Processing ---

/**
 * Flattens a nested JavaScript object into a single-level object.
 * Nested keys are combined with underscores. For example, { a: { b: 1 } } becomes { a_b: 1 }.
 * This is useful for preparing complex event data for analytics platforms like PostHog
 * that may prefer or require flat data structures.
 * @param {object} obj - The object to flatten.
 * @param {string} parentKey - The prefix for keys in the current level of recursion.
 * @param {object} result - The accumulator object for the flattened properties.
 * @returns {object} The flattened object.
 */
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          // If the property is an array, process it with processArray
          processArray(obj[key], newKey, result);
        } else {
          // If it's a nested object, recurse
          flattenObject(obj[key], newKey, result);
        }
      } else {
        // If it's a primitive value, add it to the result
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

/**
 * Processes arrays within an object being flattened by `flattenObject`.
 * Array elements are keyed with their index, e.g., array_0, array_1.
 * If an array element is an object, it's flattened recursively.
 * @param {Array} arr - The array to process.
 * @param {string} parentKey - The key for this array in the parent object.
 * @param {object} result - The accumulator object for the flattened properties.
 */
function processArray(arr, parentKey, result) {
  arr.forEach((item, index) => {
    const arrayKey = `${parentKey}_${index}`;
    if (item && typeof item === 'object') {
      // If an array item is an object, flatten it
      flattenObject(item, arrayKey, result);
    } else {
      // Otherwise, add the primitive item to the result
      result[arrayKey] = item;
    }
  });
}

// --- Main Event Processing and Reporting Function ---

/**
 * Processes a Shopify event, flattens its data, and reports it to PostHog.
 * @param {object} event - The Shopify event object.
 *                         Contains `name` (string) and `data` (object), `context` (object).
 */
function processAndReportEvent(event) {
    
  // Filter out common, high-volume events that might not be needed for all analyses.
  // PostHog's snippet by default captures page_viewed, so this avoids duplication if autocapture is on for pageviews.
  if (["page_viewed", "product_viewed", "collection_viewed"].includes(event.name)) {
     return; // Exit if the event is one of these types
  }

  // Validate that event data exists and is an object.
  if (!event.data || typeof event.data !== 'object') {
    console.log('Invalid event (missing or non-object data):', event.name, event.data);
    return; // Exit if data is invalid
  }

  // --- PostHog Initialization ---
  // This is the standard PostHog JavaScript snippet.
  // It ensures PostHog is loaded and initialized before any events are sent.
  // IMPORTANT: This initialization should ideally happen once per page load,
  // usually in the <head> of your HTML or at the very start of your main JS file.
  // If this `processAndReportEvent` function can be called multiple times,
  // consider moving the init block to a place where it's guaranteed to run only once.
  // However, PostHog's init is idempotent, so calling it multiple times won't break things,
  // but it's less efficient.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init be ys Ss me gs ws capture Ne calculateEventProperties xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  // Initialize PostHog with your project API key and specific configurations.
  // - `api_host`: Your PostHog instance URL.
  // - `person_profiles`: 'always' ensures person profiles are created/updated on identify/alias calls.
  // - `autocapture`: false - disables automatic capturing of clicks, form submissions, etc. (as we're doing it manually).
  // - `capture_pageview`: false - disables automatic pageview capturing (Shopify might send its own, or you handle it separately).
  // - `disable_session_recording`: true - disables session recording if not needed.
  // - `capture_pageleave`: false - disables capturing page leave events.
  // - `advanced_disable_decide`: true - potentially disables fetching feature flags, etc., on init if managed elsewhere.
  posthog.init('YOUR_POSTHOG_PROJECT_API_KEY',{api_host:"https://us.i.posthog.com", person_profiles: 'always',autocapture: false, capture_pageview: false, disable_session_recording: true, capture_pageleave: false, advanced_disable_decide:true});

  // Shopify event data often has a nested structure, e.g., event.data.checkout, event.data.product.
  // We extract the main nested data object first.
  const eventDataKey = Object.keys(event.data)[0]; // Gets the first key, e.g., 'checkout', 'product'
  const nestedData = event.data[eventDataKey];
  const flattenedData = flattenObject(nestedData); // Flatten the nested data for PostHog
  
  // Prepare the properties object to be sent with the PostHog event.
  let properties = {
    eventDataKey: eventDataKey, // Store the original top-level key from event.data for reference
    ...flattenedData,           // Spread the flattened event data
    // Add standard PostHog properties related to the current page URL:
    $current_url: event.context.document.location.href,
    $host: event.context.document.location.host,
    $pathname: event.context.document.location.pathname,
  };

  // Special handling for specific checkout events to identify users and set user properties.
  if (["checkout_completed", "checkout_contact_info_submitted"].includes(event.name)) {
    // For these events, we want to set user properties in PostHog.
    // `$set` is a PostHog specific instruction to update user properties.
    properties.$set = {
      email: nestedData.email, // Assuming email is available directly in nestedData
      first_name: nestedData.billingAddress?.firstName, // Safely access firstName
      last_name:  nestedData.billingAddress?.lastName,  // Safely access lastName
      // `alias` is listed here but `posthog.alias()` is called separately below.
      // It's good practice to include it if these properties are meant to define the user.
      alias: nestedData.email,
    };

    // Send the event to PostHog
    let res = posthog.capture(event.name, properties);
    
    // `posthog.alias()` is used to link the current anonymous user ID with a known identifier (email).
    // This is crucial for tracking users across sessions and devices once they identify themselves.
    // It links the current `posthog.get_distinct_id()` to `nestedData.email`.
    // Ensure `nestedData.email` is valid and available.
    if (nestedData.email) {
      posthog.alias(posthog.get_distinct_id(), nestedData.email);
    }

    return res;
  }
  else {
    // For all other events, capture them with the prepared properties.
    let res = posthog.capture(event.name, properties);
    return res;
  }
}

// --- Shopify Event Subscription ---

// `analytics.subscribe` is a Shopify specific API to listen to various store events.
// "all_standard_events": Subscribes to all standard customer events emitted by Shopify.
// When any such event occurs, the `processAndReportEvent` function is called with the event object.
analytics.subscribe("all_standard_events", (event) => processAndReportEvent(event));
