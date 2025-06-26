# PostHog Snippets

This repository contains a collection of code snippets to help you integrate PostHog analytics and implement A/B testing on various platforms. PostHog is an open-source product analytics platform that helps you understand your users and build better products.

These snippets are designed to be easily customizable and can be adapted to fit your specific needs.

## Repository Structure

The snippets in this repository are organized as individual files. Each filename clearly indicates:

*   **The platform** it's intended for (e.g., `Clickfunnels`, `Shopify`, `WordPress`).
*   **The functionality** it provides (e.g., `AB test`, `Install PostHog`, `Dynamic Webinar Registration Form`).

There are no subdirectories; all snippets are located in the root of the repository.

## How to Use

1.  **Find the snippet:** Locate the file corresponding to your platform and desired functionality.
2.  **Copy the code:** Open the file and copy the entire code snippet.
3.  **Customize (if necessary):**
    *   Many snippets require you to replace placeholder values. These are usually indicated with asterisks (e.g., `******************************************`) or descriptive terms in uppercase (e.g., `**FEATURE FLAG KEY**`, `**CONTROL_CSS_ID**`).
    *   Review the comments within the snippet for specific instructions on what to customize.
4.  **Embed the snippet:** Paste the customized snippet into the appropriate place in your website's code. This is typically within `<script>` tags in the `<head>` or before the closing `</body>` tag, but refer to your platform's documentation for the best placement.
    *   **Shopify:** You can add snippets to your `theme.liquid` file or use Shopify's script tag API.
    *   **WordPress:** Snippets can often be added via a plugin that allows custom code insertion, or directly into theme files (though this is less recommended if you're not comfortable with child themes).
    *   **Clickfunnels:** Snippets can be added to the "Tracking Code" sections (e.g., Head Tracking Code or Body Tracking Code) in your funnel or page settings.

### A/B Testing Snippets

These snippets (e.g., `AB test on Clickfunnels`) allow you to run A/B tests using PostHog feature flags.

*   **Prerequisites:**
    *   A PostHog account with feature flags set up for your A/B test variations.
    *   The PostHog JavaScript snippet already installed on your page.
*   **Customization:**
    *   `testSlug`: Replace `**FEATURE FLAG KEY**` with the actual key of your feature flag in PostHog.
    *   `variations`:
        *   The `control` key should generally be left as is.
        *   For each test group (e.g., `test_group_1`, `test_group_2`):
            *   `selector`: Replace `**CONTROL_CSS_ID**`, `**TG1_CSS_ID**`, etc., with the actual CSS selectors (e.g., `#my-element`, `.my-class`) of the elements you want to modify for that variation.
            *   `updates`: Modify the `style`, `innerHTML`, `href`, etc., attributes of the selected elements as needed for your test. The example shows hiding/showing elements, but you can change other properties too.
*   **How it works:** The script checks if a URL parameter matching the `testSlug` is present. If so, it applies that variation. Otherwise, it waits for PostHog feature flags to load and applies the variation determined by the flag.

### PostHog Installation Snippets

These snippets (e.g., `Install PostHog on Shopify`) are the basic PostHog JavaScript SDK setup.

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