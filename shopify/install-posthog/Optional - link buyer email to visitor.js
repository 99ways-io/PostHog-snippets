// Optional addition to the custom pixel: link the buyer's email to the storefront visitor ID
// Guide: https://99ways.io/how-we-installed-posthog-on-shopify-and-captured-all-events/
// Use only if you may send buyer email addresses to PostHog and the theme never calls identify().
// Paste below the main pixel code; it reuses POSTHOG_PROJECT_KEY, POSTHOG_HOST and privacy.

// Optional: link the buyer's email to the storefront visitor ID.
// Use only if you may send buyer email addresses to PostHog and the theme never calls identify().
analytics.subscribe('checkout_completed', async event => {
  if (privacy?.analyticsProcessingAllowed !== true) return;
  const email = event.data?.checkout?.email?.trim().toLowerCase();
  let storefrontId = '';
  try {
    storefrontId = decodeURIComponent(await browser.cookie.get('ph_storefront_id') || '');
  } catch (_) {}
  // Consent can change while the cookie read is pending.
  if (privacy?.analyticsProcessingAllowed !== true) return;
  if (!email || !storefrontId || storefrontId === email) return;

  try {
    const response = await fetch(POSTHOG_HOST + '/i/v0/e/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        api_key: POSTHOG_PROJECT_KEY,
        event: '$create_alias',
        distinct_id: email,
        properties: { alias: storefrontId },
      }),
    });
    if (!response.ok) console.error('PostHog alias failed: ' + response.status);
  } catch (error) {
    console.error(error.message);
  }
});
