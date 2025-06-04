/**
 * PostHog Initialization Snippet for WordPress (and other basic JS environments)
 *
 * This script provides a placeholder for initializing the PostHog JavaScript SDK.
 *
 * Instructions:
 * 1. **IMPORTANT**: Replace the placeholder below with your actual PostHog initialization snippet.
 *    You can find this in your PostHog project settings (typically under "Project API Keys").
 *    It includes your unique API key and API host.
 * 2. Place this script in your WordPress site, ideally in the <head> section or
 *    enqueued properly via your theme's functions.php or a custom plugin.
 *    For simple setups, a plugin like "Insert Headers and Footers" can be used.
 * 3. After initialization, you can use `posthog.capture('your_event_name')` to track custom events.
 *    Consider if PostHog's autocapture or pageview capture settings are appropriate for your site.
 *
 * For more advanced WordPress integrations, such as tracking user logins, comments,
 * or e-commerce events (if using WooCommerce), you may need to write additional
 * JavaScript that hooks into WordPress actions/filters or specific plugin events,
 * then uses `posthog.capture()` or `posthog.identify()` accordingly.
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
  // Common configurations:
  // capture_pageview: true, // Set to true if you want PostHog to automatically capture page views
  // autocapture: true,      // Set to true if you want PostHog to attempt to autocapture events (clicks, form submissions)
  // person_profiles: 'always' // Or 'identified_only'
});
*/

// =============================================================================
// END POSTHOG INITIALIZATION
// =============================================================================

// Example of capturing a custom event after initialization:
// if (typeof posthog !== 'undefined') {
//   posthog.capture('wordpress_user_logged_in', { property: 'value' });
// }

// Example of identifying a user (e.g., after login):
// if (typeof posthog !== 'undefined' && someUserIsLoggedIn) {
//   posthog.identify(
//     userId, // Unique ID for the user (e.g., WordPress User ID)
//     { email: userEmail, username: userName } // User properties
//   );
// }
