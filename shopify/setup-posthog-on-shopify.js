/**
 * PostHog Setup and Event Tracking Snippet for Shopify
 *
 * This script initializes PostHog and subscribes to Shopify's standard customer events
 * to send data to your PostHog instance.
 *
 * How it works:
 * 1. Initializes the PostHog JavaScript SDK (you need to provide your init snippet).
 * 2. Subscribes to Shopify's `all_standard_events`.
 * 3. For each event, it flattens the event data object.
 * 4. It captures the event in PostHog, enriching it with URL context.
 * 5. For specific checkout events, it sets person properties (email, name) and calls `posthog.alias`.
 *
 * Instructions:
 * 1. **IMPORTANT**: Replace the placeholder below with your actual PostHog initialization snippet.
 *    You can find this in your PostHog project settings. It includes your API key and API host.
 * 2. This script assumes Shopify's `analytics` object is available.
 * 3. Review the `processAndReportEvent` function if you need to customize
 *    event data or properties further.
 */

// =============================================================================
// START POSTHOG INITIALIZATION
// =============================================================================

// PASTE YOUR POSTHOG INIT SNIPPET HERE
// You can find this in your PostHog project settings.
// It will look something like this:
/*
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init be ys Ss me gs ws capture Ne calculateEventProperties xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('YOUR_API_KEY', {
  api_host: 'YOUR_API_HOST', // e.g., 'https://us.i.posthog.com' or 'https://eu.i.posthog.com'
  // Other configurations (ensure these are appropriate for Shopify):
  person_profiles: 'always', // Recommended to identify users
  autocapture: false,        // Shopify provides its own event system, so manual capture is preferred
  capture_pageview: false,   // Typically handled by Shopify or manually via events
  disable_session_recording: true, // Adjust as needed
  capture_pageleave: false,
  advanced_disable_decide: true // Often set for more control over feature flags
});
*/
// Make sure PostHog is initialized before subscribing to events.
// If your init snippet is asynchronous, you might need to wrap the
// analytics.subscribe call in a function that PostHog calls on initialization.
// For simplicity, this script assumes PostHog is initialized synchronously or soon enough.

// =============================================================================
// END POSTHOG INITIALIZATION
// =============================================================================

/**
 * Flattens a nested object into a single-level object.
 * Array elements are processed, and their contents are also flattened.
 * @param {object} obj - The object to flatten.
 * @param {string} parentKey - The prefix for keys in the flattened object (used in recursion).
 * @param {object} result - The accumulator for flattened keys and values.
 * @returns {object} The flattened object.
 */
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          processArray(obj[key], newKey, result);
        } else {
          flattenObject(obj[key], newKey, result);
        }
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

/**
 * Processes an array, flattening its elements (if objects) or adding them to the result.
 * Called by flattenObject.
 * @param {Array} arr - The array to process.
 * @param {string} parentKey - The prefix for keys from this array.
 * @param {object} result - The accumulator object.
 */
function processArray(arr, parentKey, result) {
  arr.forEach((item, index) => {
    const arrayKey = `${parentKey}_${index}`;
    if (item && typeof item === 'object') {
      flattenObject(item, arrayKey, result); // Flatten objects within arrays
    } else {
      result[arrayKey] = item; // Add primitive array elements directly
    }
  });
}

/**
 * Processes a Shopify analytics event and sends it to PostHog.
 * @param {object} event - The event object from Shopify's analytics.subscribe.
 */
function processAndReportEvent(event) {
  // Ensure PostHog is available
  if (typeof posthog === 'undefined') {
    console.warn('PostHog SDK not found. Skipping event:', event.name);
    return;
  }

  // Ignore Shopify's own page/product/collection viewed events if PostHog captures pageviews,
  // or if you prefer to capture these manually with more specific properties.
  // Adjust this list as per your tracking strategy.
  if (["page_viewed", "product_viewed", "collection_viewed"].includes(event.name)) {
    console.log('PostHog Shopify: Ignoring Shopify standard event:', event.name, '(handled by PostHog pageview or other custom tracking)');
    return;
  }

  if (!event.data || typeof event.data !== 'object') {
    console.warn('PostHog Shopify: Invalid or missing event data for event:', event.name, event.data);
    return;
  }

  // Extract the primary data object from event.data (e.g., event.data.checkout, event.data.product)
  // Shopify's event structure usually has a single key under `data`.
  const eventDataKey = Object.keys(event.data)[0];
  const nestedData = eventDataKey ? event.data[eventDataKey] : {}; // Use event.data directly if no sub-key

  // Flatten the core event data
  const flattenedData = flattenObject(nestedData);

  // Prepare properties for PostHog
  let properties = {
    event_specific_data_key: eventDataKey, // Store the original top-level key from event.data
    ...flattenedData, // Spread the flattened event data
    // Add Shopify context and event name
    shopify_event_name: event.name,
    shopify_event_id: event.id,
    shopify_event_timestamp: event.timestamp,
    // Standard PostHog properties for context
    $current_url: event.context?.document?.location?.href || window.location.href,
    $host: event.context?.document?.location?.host || window.location.host,
    $pathname: event.context?.document?.location?.pathname || window.location.pathname,
  };

  // For specific events, set person properties and alias the user
  if (["checkout_completed", "checkout_contact_info_submitted"].includes(event.name)) {
    const email = nestedData.email;
    const billingAddress = nestedData.billingAddress;

    if (email) {
      properties.$set = { // PostHog person properties
        email: email,
        // It's good practice to check if these properties exist before assigning
        first_name: billingAddress?.firstName,
        last_name: billingAddress?.lastName,
        phone: billingAddress?.phone,
        // You can add more properties from billingAddress or other data sources
      };

      // Identify the user with their email if available.
      // This helps link anonymous activity before this event to this user.
      posthog.identify(email);

      // Alias the current PostHog distinct_id to the user's email.
      // This is crucial if the distinct_id might change (e.g., across devices)
      // and you want to ensure all activity is tied to the same user profile.
      // Ensure posthog.get_distinct_id() is available and returns the correct ID.
      if (typeof posthog.get_distinct_id === 'function') {
         const currentDistinctId = posthog.get_distinct_id();
         if (currentDistinctId !== email) { // Only alias if distinct_id is not already the email
            posthog.alias(email, currentDistinctId);
            console.log('PostHog Shopify: Aliased ' + currentDistinctId + ' to ' + email);
         }
      } else {
          console.warn('PostHog Shopify: posthog.get_distinct_id() is not available. Cannot alias.');
      }
    }
  }

  // Capture the event in PostHog
  posthog.capture(event.name, properties);
  console.log('PostHog Shopify: Captured event -', event.name, properties);
}

// Subscribe to all standard Shopify customer events
if (typeof analytics !== 'undefined' && typeof analytics.subscribe === 'function') {
  analytics.subscribe("all_standard_events", (event) => {
    if (event) { // Basic check to ensure event object is passed
      processAndReportEvent(event);
    } else {
      console.warn('PostHog Shopify: Received an undefined event from analytics.subscribe.');
    }
  });
  console.log('PostHog Shopify: Subscribed to all_standard_events.');
} else {
  console.error('PostHog Shopify: Shopify `analytics` object not found or `analytics.subscribe` is not a function. PostHog event tracking will not work.');
}
