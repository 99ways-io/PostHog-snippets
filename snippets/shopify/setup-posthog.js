// This script is designed for Shopify environments where `analytics.subscribe` is available.
// It captures Shopify standard events and sends them to PostHog.

// Example of subscribing to specific events (optional):
// analytics.subscribe("product_added_to_cart", event => {
//   console.log("Product added to cart event: ", event?.data);
//   // You could add specific PostHog tracking here if needed,
//   // though processAndReportEvent will also capture it if subscribed to "all_standard_events".
// });

// Helper function to flatten a nested object into a single-level object.
// E.g., { a: { b: 1 }, c: 2 } becomes { a_b: 1, c: 2 }
function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          // Handle array by iterating over its elements
          processArray(obj[key], newKey, result);
        } else {
          // Recursively flatten the object
          flattenObject(obj[key], newKey, result);
        }
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

// Helper function to process arrays within the object being flattened.
function processArray(arr, parentKey, result) {
  arr.forEach((item, index) => {
    const arrayKey = `${parentKey}_${index}`;
    if (item && typeof item === 'object') {
      flattenObject(item, arrayKey, result); // Flatten nested objects within arrays
    } else {
      result[arrayKey] = item; // Add array item to results
    }
  });
}

// Processes and reports events to PostHog.
function processAndReportEvent(event) {
  // Ignore common page/product view events if they are handled by PostHog's autocapture or a separate pageview tracking.
  // Adjust this list as needed for your specific PostHog setup.
  if (["page_viewed", "product_viewed", "collection_viewed"].includes(event.name)) {
     return;
  }

  if (!event.data || typeof event.data !== 'object') {
    console.log('Invalid event (missing data object):', event.name, event.data);
    return;
  }

  // IMPORTANT: PostHog SDK Initialization.
  // The PostHog SDK is initialized here. If this function `processAndReportEvent`
  // is called multiple times (e.g., for every analytics event), this `posthog.init`
  // will also be called multiple times. The SDK has internal guards (e.__SV||)
  // to prevent re-initializing the global `posthog` object itself. However,
  // it's generally recommended to initialize PostHog once when the page loads.
  // If this script is part of a larger setup where PostHog is already initialized,
  // you might consider removing or conditionally calling this init block.
  // For this snippet's standalone purpose, it's included to ensure PostHog is available.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init be ys Ss me gs ws capture Ne calculateEventProperties xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_IWLQpvhYc6JLDXIT067cH0bEnet9NUjUfoIPg9DXDhd', { // Replace with your actual Project API Key
    api_host: "https://us.i.posthog.com", // Replace with your PostHog API host
    person_profiles: 'always',
    autocapture: false, // Recommended: false, as this script manually captures events
    capture_pageview: false, // Recommended: false, manage pageviews separately or via Shopify's native integration
    disable_session_recording: true, // Adjust as needed
    capture_pageleave: false, // Adjust as needed
    advanced_disable_decide: true // Adjust as needed
  });

  // Extract the primary data object from event.data (e.g., event.data.checkout, event.data.product)
  const eventDataKey = Object.keys(event.data)[0];
  const nestedData = event.data[eventDataKey];

  // Flatten the nested data from the event
  const flattenedData = flattenObject(nestedData || {}); // Pass empty object if nestedData is null/undefined

  // Prepare the properties object for PostHog
  let properties = {
    eventDataKey: eventDataKey, // The source key of the data (e.g., "checkout", "product")
    ...flattenedData,       // Spread the flattened event data
    // Shopify context properties (available in `event.context`)
    $current_url: event.context?.document?.location?.href,
    $host: event.context?.document?.location?.host,
    $pathname: event.context?.document?.location?.pathname,
    // You can add more context if needed:
    // shopify_page_title: event.context?.document?.title,
    // shopify_user_agent: event.context?.navigator?.userAgent,
  };

  // For specific events like checkout completion, identify the user and set person properties
  if (["checkout_completed", "checkout_contact_info_submitted"].includes(event.name) && nestedData) {
    if (nestedData.email) {
      posthog.identify(nestedData.email); // Identify the user by email
      properties.$set = { // Set user properties in PostHog
        email: nestedData.email,
        first_name: nestedData.billingAddress?.firstName,
        last_name:  nestedData.billingAddress?.lastName,
        // Add other relevant user properties from billingAddress or customer object
      };
      // Consider aliasing if you have previous anonymous users
      // posthog.alias(posthog.get_distinct_id(), nestedData.email); // Call alias if appropriate
    }
  }

  // Capture the event in PostHog
  posthog.capture(event.name, properties);
  console.log(`PostHog event captured: ${event.name}`, properties);
}

// Subscribe to all Shopify standard customer events.
// See Shopify docs for a list of standard events:
// https://shopify.dev/docs/api/web-pixels-api/standard-events
analytics.subscribe("all_standard_events", (event) => processAndReportEvent(event));

// Example of how to subscribe to a specific event if needed:
// analytics.subscribe("checkout_completed", (event) => {
//   console.log("Checkout completed specific subscription:", event);
//   processAndReportEvent(event); // You can still use the common processor
// });
