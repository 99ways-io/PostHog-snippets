# PostHog Snippets

This repository contains a collection of code snippets to help you integrate PostHog analytics and implement A/B testing on various platforms. PostHog is an open-source product analytics platform that helps you understand your users and build better products.

These snippets are designed to be easily customizable and can be adapted to fit your specific needs.

## Repository Structure

This repository is organized into a main `snippets` directory, which contains subdirectories for different platforms and generic use cases.

*   **`snippets/`**
    *   **`clickfunnels/`**: Snippets specifically for Clickfunnels.
    *   **`shopify/`**: Snippets for Shopify stores.
    *   **`wordpress/`**: Snippets tailored for WordPress sites.
    *   **`generic/`**: Snippets that can be used on various platforms or for general HTML/JS/CSS tasks.

Each filename generally indicates its functionality (e.g., `ab-test.js`, `install-posthog.js`, `dynamic-webinar-registration-form.html`).

File types:
*   **`.js` files**: These are JavaScript files. They **do not** include `<script>` tags. You will need to wrap the code from these files in `<script> </script>` tags when adding them to your website.
*   **`.html` files**: These are HTML files. They may contain HTML structure, `<style>` tags for CSS, and `<script>` tags for JavaScript. They can often be copied and pasted directly where needed, or their relevant parts extracted.
*   **`.css` files**: These are CSS files. The styles can be copied into an existing CSS file on your site, or linked directly if appropriate for your setup (usually by placing the content within `<style> </style>` tags in your HTML, or including it in your site's main stylesheet).

## How to Use

1.  **Navigate to the snippet:**
    *   Go to the `snippets` directory.
    *   Choose the subdirectory relevant to your platform (e.g., `shopify/`) or `generic/` for general-purpose snippets.
    *   Locate the file for the functionality you need (e.g., `ab-test.js` or `dynamic-webinar-registration-form.html`).
2.  **Copy the code:** Open the file and copy its entire content.
3.  **Customize (if necessary):**
    *   Many snippets require you to replace placeholder values. These are usually indicated with asterisks (e.g., `******************************************`) or descriptive terms in uppercase (e.g., `**FEATURE FLAG KEY**`, `**CONTROL_CSS_ID**`).
    *   Review the comments within the snippet for specific instructions on what to customize.
4.  **Embed the snippet:**
    *   **For `.js` files:** Paste the copied JavaScript code *inside* `<script></script>` tags in your website's HTML. This is typically done in the `<head>` section or just before the closing `</body>` tag. For A/B testing snippets, ensure they are placed *after* your main PostHog installation snippet.
        ```html
        <script>
        // Paste .js file content here
        </script>
        ```
    *   **For `.html` files:** Paste the content into your HTML where the component should appear. If it's a full HTML structure, it might replace an existing section or be added as a new one. If it's a self-contained widget like the webinar form, you can usually paste it directly.
    *   **For `.css` files:**
        *   Option 1: Copy the CSS rules and paste them into your website's existing stylesheet (e.g., `style.css`).
        *   Option 2: Paste the CSS rules inside `<style></style>` tags within the `<head>` section of your HTML document.
        ```html
        <style>
        /* Paste .css file content here */
        </style>
        ```

    Refer to your platform's documentation for the best placement and methods for adding custom code:
    *   **Shopify:** You can add snippets to your `theme.liquid` file (for JS/CSS in `<script>`/`<style>` tags or direct HTML), create custom Liquid sections/snippets, or use Shopify's script tag API for some JavaScript.
    *   **WordPress:** Snippets can often be added via a plugin that allows custom code insertion (e.g., "Insert Headers and Footers" or "WPCode"), or directly into theme files (e.g., `functions.php` for PHP, or template files for HTML/JS; use a child theme for modifications to avoid losing them on theme updates).
    *   **Clickfunnels:** Snippets can be added to the "Tracking Code" sections (e.g., Head Tracking Code or Body Tracking Code for JS/CSS in `<script>`/`<style>` tags) in your funnel or page settings, or into custom HTML/JS elements on the page.

### A/B Testing Snippets (`ab-test.js`)

These JavaScript snippets (e.g., `snippets/clickfunnels/ab-test.js`) allow you to run A/B tests using PostHog feature flags.

*   **Prerequisites:**
    *   A PostHog account with a feature flag set up for your A/B test variations (e.g., a flag named `my-experiment` with variants like `control`, `test_group_1`).
    *   The main PostHog JavaScript installation snippet (e.g., `install-posthog.js`) must already be correctly installed and initialized on your page *before* this A/B test script runs.
*   **Customization (refer to comments within the specific `ab-test.js` file):**
    *   `testSlug`: Replace `**FEATURE FLAG KEY**` with the actual key of your feature flag in PostHog.
    *   `variations` (or `variationElements` in some versions): Configure the CSS selectors and the changes (styles, content, etc.) for your control and test groups.
        *   The keys for your test groups (e.g., `test_group_1`) MUST match the variant keys defined in your PostHog feature flag.
*   **How it works:** The script typically checks if a URL parameter matching the `testSlug` is present (for QA/forcing a variant). If not, it waits for PostHog feature flags to load and applies the variation determined by the flag assigned to the user. Elements are manipulated (e.g., shown/hidden, styles changed) based on the active variation.

### PostHog Installation Snippets (`install-posthog.js`)

These JavaScript snippets (e.g., `snippets/shopify/install-posthog.js`) are the basic PostHog JavaScript SDK setup.

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