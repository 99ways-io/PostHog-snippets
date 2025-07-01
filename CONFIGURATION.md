
# Configuration Guide

## PostHog Setup
1. Replace `YOUR_POSTHOG_PROJECT_API_KEY` with your actual PostHog Project API Key
2. Update `api_host` to match your PostHog instance:
   - US Cloud: `https://us.i.posthog.com`
   - EU Cloud: `https://eu.i.posthog.com`
   - Self-hosted: `https://your-domain.com`

## A/B Testing Setup
1. Replace `YOUR_FEATURE_FLAG_KEY` with your actual feature flag key from PostHog
2. Update selectors in variations object to match your page elements
3. Configure test groups to match your PostHog feature flag variants

## Element Selectors Guide
- Use CSS selectors like `#element-id` for IDs
- Use `.class-name` for classes
- Use `[data-attribute="value"]` for data attributes
- Test selectors in browser console with `document.querySelector()`

## Testing Your Setup
1. Add URL parameter `?your-feature-flag-key=test_group_1` to test variations
2. Check browser console for activation messages
3. Verify PostHog events in your PostHog dashboard
