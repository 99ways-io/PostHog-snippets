# PostHog Snippets

This repository contains a collection of production-ready code snippets to help you integrate PostHog analytics and implement A/B testing on various platforms. PostHog is an open-source product analytics platform that helps you understand your users and build better products.

## Quick Start

1. **Install PostHog**: Copy the installation snippet for your platform
2. **Configure**: Replace `YOUR_POSTHOG_PROJECT_API_KEY` with your actual API key
3. **Set up A/B testing**: Copy the A/B testing snippet and configure your feature flag
4. **Test**: Use the interactive demo to validate your setup

## Repository Structure

The snippets in this repository are organized into a hierarchical directory structure:

*   **Platform-specific snippets** are located in directories named after the platform (e.g., `clickfunnels/`, `shopify/`, `wordpress/`).
    *   Within each platform directory, snippets are further categorized by functionality (e.g., `ab-testing/`, `install-posthog/`).
    *   For example, the A/B testing snippet for Clickfunnels is now at `clickfunnels/ab-testing/AB test on Clickfunnels.html`.
*   **General CSS utility snippets** are in the `css/` directory (e.g., `css/Hiding Variants.css`).
*   **Form-related snippets** can be found in the `forms/` directory (e.g., `forms/Dynamic Webinar Registration Form`).
*   **Test pages or examples** are located in the `testing/` directory (e.g., `testing/Experiment Test Page.html`).

This structure helps in easily locating snippets based on the platform and their purpose.

## How to Use

1.  **Find the snippet:** Navigate to the appropriate directory based on the platform and functionality you need. For example, to find an A/B testing snippet for Shopify, look in `shopify/ab-testing/`.
2.  **Copy the code:** Open the file and copy the entire code snippet.
3.  **Customize (if necessary):**
    *   Many snippets require you to replace placeholder values. These are usually indicated with descriptive terms (e.g., `YOUR_FEATURE_FLAG_KEY`, `#original-element`).
    *   Review the comments within the snippet for specific instructions on what to customize.
4.  **Embed the snippet:** Paste the customized snippet into the appropriate place in your website's code. This is typically within `<script>` tags in the `<head>` or before the closing `</body>` tag, but refer to your platform's documentation for the best placement.
    *   **Shopify:** You can add snippets to your `theme.liquid` file or use Shopify's script tag API.
    *   **WordPress:** Snippets can often be added via a plugin that allows custom code insertion, or directly into theme files (though this is less recommended if you're not comfortable with child themes).
    *   **Clickfunnels:** Snippets can be added to the "Tracking Code" sections (e.g., Head Tracking Code or Body Tracking Code) in your funnel or page settings.

### A/B Testing Snippets

These snippets (e.g., `clickfunnels/ab-testing/AB test on Clickfunnels.html`) allow you to run A/B tests using PostHog feature flags.

*   **Prerequisites:**
    *   A PostHog account with feature flags set up for your A/B test variations.
    *   The PostHog JavaScript snippet already installed on your page.
*   **Customization:**
    *   `testSlug`: Replace `YOUR_FEATURE_FLAG_KEY` with the actual key of your feature flag in PostHog.
    *   `variations`:
        *   The `control` key should generally be left as is.
        *   For each test group (e.g., `test_group_1`, `test_group_2`):
            *   `selector`: Replace `#original-element`, `#variant-one-element`, etc., with the actual CSS selectors (e.g., `#my-element`, `.my-class`) of the elements you want to modify for that variation.
            *   `updates`: Modify the `style`, `innerHTML`, `href`, etc., attributes of the selected elements as needed for your test. The example shows hiding/showing elements, but you can change other properties too.
*   **How it works:** The script checks if a URL parameter matching the `testSlug` is present. If so, it applies that variation. Otherwise, it waits for PostHog feature flags to load and applies the variation determined by the flag.

### PostHog Installation Snippets

These snippets (e.g., `shopify/install-posthog/Install PostHog on Shopify`) are the basic PostHog JavaScript SDK setup.

*   **Prerequisites:**
    *   A PostHog account.
*   **Customization:**
    *   Replace `******************************************` with your PostHog Project API Key.
    *   Verify the `api_host` is correct for your PostHog instance (e.g., `https://us.i.posthog.com` or `https://eu.i.posthog.com` or your self-hosted domain).
*   **Placement:** This snippet should ideally be placed in the `<head>` section of your HTML to ensure PostHog loads early.

## Contributing

Contributions are welcome! If you have a new snippet to share, find a bug, or have suggestions for improvement:

1.  **Open an Issue:** Discuss the change you wish to make.
2.  **Fork the repository.**
3.  **Create a new branch** for your changes.
4.  **Make your changes.**
5.  **Test your changes thoroughly.**
6.  **Submit a Pull Request** with a clear description of your changes.

## Disclaimer

The snippets provided in this repository are for guidance and illustrative purposes. Always test code snippets thoroughly in a staging or development environment before deploying them to a live production website. Ensure they are compatible with your specific platform version, theme, and other installed plugins or scripts. The authors or contributors of this repository are not responsible for any issues that may arise from the use of these snippets.
