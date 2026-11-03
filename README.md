# PostHog snippets

Copy-paste code for installing PostHog and running page experiments on WordPress, ClickFunnels and Shopify. Each file matches a step-by-step guide on [99ways.io](https://99ways.io/) that explains where the code goes, what to change and how to check that it works. Read the guide before pasting: the code alone does not cover consent, identity across domains or verification.

| Platform | Install PostHog | A/B test a page | Guides |
| --- | --- | --- | --- |
| WordPress | [`Install PostHog on WordPress.html`](wordpress/install-posthog/Install%20PostHog%20on%20WordPress.html), with [`Wait for consent.html`](wordpress/install-posthog/Wait%20for%20consent.html) if capture must wait for consent | [`AB test on WordPress.html`](wordpress/ab-testing/AB%20test%20on%20WordPress.html) | [Install](https://99ways.io/how-we-installed-posthog-on-wordpress/) · [A/B test](https://99ways.io/how-to-setup-posthog-a-b-test-on-wordpress/) |
| ClickFunnels | [`Install PostHog on Clickfunnels.html`](clickfunnels/install-posthog/Install%20PostHog%20on%20Clickfunnels.html) (waits for consent) | [`AB test on Clickfunnels.html`](clickfunnels/ab-testing/AB%20test%20on%20Clickfunnels.html) | [Install](https://99ways.io/how-we-installed-posthog-on-clickfunnels/) · [A/B test](https://99ways.io/how-to-setup-posthog-a-b-test-on-clickfunnels/) |
| Shopify | [`Theme snippet for theme.liquid.html`](shopify/install-posthog/Theme%20snippet%20for%20theme.liquid.html) for the storefront and [`Install PostHog on Shopify.js`](shopify/install-posthog/Install%20PostHog%20on%20Shopify.js) as a Customer Events custom pixel for checkout; two optional pixel additions | [`AB test on Shopify.html`](shopify/ab-testing/AB%20test%20on%20Shopify.html) | [Install](https://99ways.io/how-we-installed-posthog-on-shopify-and-captured-all-events/) · [A/B test](https://99ways.io/how-to-setup-posthog-a-b-test-on-shopify/) |

## Before you paste

- **Project token and host.** Replace `YOUR_POSTHOG_PROJECT_TOKEN` with your project token. It is public and safe in browser code; a personal API key never belongs there. Use your region's ingestion host, `https://us.i.posthog.com` or `https://eu.i.posthog.com`, or your reverse proxy.
- **`defaults`.** The WordPress and ClickFunnels files pin `defaults: '2026-05-30'`, the date our guides use; the Shopify theme snippet asks you to add your project's own date. PostHog has published later dates (the latest is `2026-08-30`); they change session-recording capture, for example `streamNetworkBody` from `2026-06-25`, and make `cookieWinsOnConflict` the default from `2026-08-29`. Keep the date your project's own snippet shows, and read [what each date changes](https://posthog.com/docs/libraries/js/config) before moving to a later one.
- **`person_profiles: 'identified_only'`.** PostHog creates a person profile only for visitors you identify, so anonymous traffic does not create profiles for every visitor. Earlier versions of these files set `'always'`.
- **Consent.** The ClickFunnels snippet keeps capture and storage off until the visitor allows analytics, and the Shopify snippets start PostHog only after Shopify's privacy API allows it; the WordPress snippet can wait for consent with the optional file. The guides show how to connect each to a consent tool.

## Page experiments

The A/B files use [PostHog Page Experiments](https://github.com/99ways-io/posthog-page-experiments), our open-source runner (MIT). PostHog assigns visitors and analyzes the result; the runner checks that the page can show the change before recording an exposure, applies the assigned variant, falls back to control when a flag is late or missing, and lets you preview a variant with `?<flag-key>=<variant>` in the URL. Hide the variant elements with [`css/Hiding Variants.css`](css/Hiding%20Variants.css); the runner shows the assigned one.

## What changed in November 2026

- Install files: `person_profiles` from `'always'` to `'identified_only'`, `defaults` from `'2025-05-24'` to `'2026-05-30'`, the current PostHog loader, and consent handling from the guides.
- Shopify: the custom pixel that loaded the PostHog SDK inside Shopify's sandbox, with autocapture and feature flags off and an `alias` call at checkout, is replaced by the guides' two-part setup: a theme snippet for the storefront and a custom pixel that sends checkout events to PostHog's capture API under the storefront visitor's ID.
- A/B files: the inline variant script is replaced by PostHog Page Experiments, which no longer records an exposure for visitors who cannot see the change and waits for consent.
- Removed: `css/Hiding control-group.css` (a rule without a selector) and `testing/Experiment Test Page.html` (a demo of the old script). The runner's repository has a demo and tests.

## Disclaimer

Test every snippet on a staging site or an unpublished theme before it reaches visitors, and check it against your platform version, theme, consent tool and other scripts.
