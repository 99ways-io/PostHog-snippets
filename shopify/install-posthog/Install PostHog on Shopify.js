// Install PostHog on Shopify: the Customer Events custom pixel
// Guide: https://99ways.io/how-we-installed-posthog-on-shopify-and-captured-all-events/
// Add in Shopify admin: Settings -> Customer events -> Add custom pixel. Requires the theme snippet
// ("Theme snippet for theme.liquid.html") for the storefront ID bridge.
// Custom pixels run in a sandbox, so this sends events to PostHog's capture API instead of
// loading the PostHog SDK. It sends only when the visitor allows analytics, and does not create
// person profiles. Replace the project token and host below.

const POSTHOG_PROJECT_KEY = 'YOUR_POSTHOG_PROJECT_TOKEN';
const POSTHOG_HOST = 'https://eu.i.posthog.com'; // US: https://us.i.posthog.com

let privacy = init.customerPrivacy;
api.customerPrivacy.subscribe('visitorConsentCollected', event => {
  privacy = event.customerPrivacy;
});

async function sendToPostHog(event) {
  if (privacy?.analyticsProcessingAllowed !== true || !event.clientId) return;

  const location = event.context?.document?.location;
  if (!location?.href) return;
  const url = new URL(location.href);
  const checkout = event.data?.checkout;
  const variant = event.data?.productVariant
    ?? event.data?.cartLine?.merchandise;

  let bridgedId = '';
  try {
    const encodedId = await browser.cookie.get('ph_storefront_id');
    bridgedId = encodedId ? decodeURIComponent(encodedId) : '';
  } catch (_) {
    // A missing or unreadable cookie leaves an explicitly separate stream.
  }
  // Consent can change while the asynchronous cookie read is pending.
  if (privacy?.analyticsProcessingAllowed !== true) return;

  const properties = {
    $process_person_profile: false,
    $current_url: url.origin + url.pathname,
    $host: url.host,
    $pathname: url.pathname,
    event_source: 'shopify_custom_pixel',
    identity_source: bridgedId ? 'storefront_bridge' : 'shopify_client_id',
    shopify_event_id: event.id,
  };
  if (variant?.id) properties.product_variant_id = variant.id;
  if (checkout?.token) properties.checkout_token = checkout.token;
  if (checkout?.order?.id) properties.order_id = checkout.order.id;
  if (checkout?.currencyCode) properties.currency = checkout.currencyCode;
  if (checkout?.totalPrice?.amount != null) {
    const value = Number(checkout.totalPrice.amount);
    if (Number.isFinite(value)) properties.checkout_total = value;
  }

  const response = await fetch(POSTHOG_HOST + '/i/v0/e/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      api_key: POSTHOG_PROJECT_KEY,
      distinct_id: bridgedId || ('shopify:' + event.clientId),
      event: event.name,
      timestamp: event.timestamp,
      properties,
    }),
  });
  if (!response.ok) throw new Error('PostHog capture failed: ' + response.status);
}

for (const name of [
  'product_viewed',
  'product_added_to_cart',
  'checkout_started',
  'checkout_completed',
]) {
  analytics.subscribe(name, event => {
    sendToPostHog(event).catch(error => console.error(error.message));
  });
}
