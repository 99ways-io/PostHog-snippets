// PostHog Analytics Snippet
// This script initializes PostHog on your website.
// For more information on PostHog and how to use it, visit https://posthog.com/docs

!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

// Initialize PostHog
// IMPORTANT: Replace '******************************************' with your actual PostHog Project API Key.
// IMPORTANT: Verify 'api_host' is correct for your PostHog instance (e.g., 'https://us.i.posthog.com', 'https://eu.i.posthog.com', or your self-hosted domain).
posthog.init('******************************************', {
    api_host: 'https://us.i.posthog.com', // Default is US host, change if you use EU or self-host.
    person_profiles: 'always', // Configures how person profiles are handled. 'always' is a common setting.
    // You can add more configuration options here as needed.
    // For example, to enable autocapture (not recommended if you plan to manually capture events):
    // autocapture: true,
    //
    // To disable session recording:
    // disable_session_recording: true,
    //
    // For full list of configuration options, see:
    // https://posthog.com/docs/libraries/js#config
});
