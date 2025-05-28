// Step 1. Initialize the JavaScript pixel SDK (make sure to exclude HTML)


// Step 2. Subscribe to customer events with analytics.subscribe(), and add tracking
//  analytics.subscribe("all_standard_events", event => {
//    console.log("Event data ", event?.data);
//  });


// Helper function to flatten the nested object
function flattenObject(obj, parentKey = '', result = {}) {

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (obj[key] && typeof obj[key] === 'object') {
        if (Array.isArray(obj[key])) {
          // Handle array by iterating over its elements
          processArray(obj[key], newKey, result);
        } else {
          // Recursively flattening the object
          flattenObject(obj[key], newKey, result);
        }
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
}

function processArray(arr, parentKey, result) {


  arr.forEach((item, index) => {
    const arrayKey = `${parentKey}_${index}`;
    if (item && typeof item === 'object') {
      flattenObject(item, arrayKey, result);
    } else {
      result[arrayKey] = item;
    }
  });
}

function processAndReportEvent(event) {
    
  if (["page_viewed", "product_viewed", "collection_viewed"].includes(event.name)) {
     return;
  }
    if (!event.data || typeof event.data !== 'object') {
    console.log('Invalid event:', event.name, event.data);
    return;
  }
  // PG init was here
 !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init be ys Ss me gs ws capture Ne calculateEventProperties xs register register_once register_for_session unregister unregister_for_session Rs getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Is ks createPersonProfile Ps bs opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing $s debug Es getPageViewId captureTraceFeedback captureTraceMetric".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_IWLQpvhYc6JLDXIT067cH0bEnet9NUjUfoIPg9DXDhd',{api_host:"https://us.i.posthog.com", person_profiles: 'always',autocapture: false, capture_pageview: false, disable_session_recording: true, capture_pageleave: false, advanced_disable_decide:true});

  // Extract the event data object
  const eventDataKey = Object.keys(event.data)[0]; // Get the first (and presumably only) key in the event data
  const nestedData = event.data[eventDataKey];
  const flattenedData = flattenObject(nestedData);
  
  // Prepare the properties object
  let properties = {
    eventDataKey: eventDataKey, // Add the event-specific key for reference
    ...flattenedData, // Spread operator to include all properties of nestedData
    $current_url:event.context.document.location.href,
    $host:event.context.document.location.host,
    $pathname:event.context.document.location.pathname,    
  };

  if (["checkout_completed", "checkout_contact_info_submitted"].includes(event.name)) {
    properties.$set = {
      email: nestedData.email,
      first_name: nestedData.billingAddress.firstName,
      last_name:  nestedData.billingAddress.lastName,
      alias: nestedData.email,
    };
      // Send the event to Posthog
    let res = posthog.capture(event.name, properties);
    
    posthog.alias(posthog.get_distinct_id(),nestedData.email);

    return res;
  }
  else {
    let res = posthog.capture(event.name, properties);
    return res;
  }
  
}

// Step 2. Subscribe to customer events with analytics.subscribe(), and add tracking
//  analytics.subscribe("event_name", event => {
//    pixel("track", "event_name", event.data);
//  });

analytics.subscribe("all_standard_events", (event) => processAndReportEvent(event));
