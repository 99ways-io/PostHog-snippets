// Optional change to the custom pixel: send every standard customer event except storefront views
// Guide: https://99ways.io/how-we-installed-posthog-on-shopify-and-captured-all-events/
// Replace the final for loop of the main pixel with this; keep sendToPostHog unchanged.

// Replace the final for loop above; keep sendToPostHog unchanged.
const storefrontViews = new Set(['page_viewed', 'collection_viewed']);
analytics.subscribe('all_standard_events', event => {
  if (storefrontViews.has(event.name)) return;
  sendToPostHog(event).catch(error => console.error(error.message));
});
