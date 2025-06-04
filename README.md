# PostHog Snippets

Welcome to PostHog Snippets! This repository is a collection of useful code snippets for integrating PostHog with various platforms and for common A/B testing scenarios. Our goal is to provide easy-to-use, well-documented code that you can quickly adapt for your projects.

## Available Snippets

Below is a list of the currently available snippets. Each snippet is located in a platform-specific directory (e.g., `shopify/`, `wordpress/`) or in a `common/` directory for generic scripts.

### Shopify

*   **[Setup PostHog on Shopify](./shopify/setup-posthog-on-shopify.js)**: Initializes PostHog on your Shopify store and tracks standard e-commerce events. This includes capturing page views, product views, collection views, checkout steps, and completed orders. It also enriches user profiles with customer data.
*   **[A/B Test on Shopify](./shopify/ab-test-on-shopify.js)**: A script to help you run A/B tests on Shopify by showing or hiding different elements based on feature flags from PostHog or URL parameters.

### WordPress

*   **[Setup PostHog on WordPress](./wordpress/setup-posthog-on-wordpress.js)**: (Placeholder - content to be reviewed and added) A guide or script to help you set up PostHog on your WordPress site.
*   **[A/B Test on WordPress](./wordpress/ab-test-on-wordpress.js)**: (Placeholder - content to be reviewed and added) A script for conducting A/B tests on WordPress using PostHog feature flags.

### Common (Generic JavaScript)

*   **[Hide Element by ID](./common/hide-element-by-id.css)**: A CSS snippet to hide a specific HTML element by its ID. Useful for quickly removing an element from view.
*   **[Hide Elements by Selector](./common/hide-elements-by-selector.css)**: A CSS snippet to hide HTML elements matching a given CSS selector. Useful for hiding multiple elements that share a class or other selector.
*   **[Experiment Test Page](./examples/experiment-test-page.html)**: (Placeholder - content to be reviewed and added) An example HTML page to demonstrate how some of the A/B testing snippets can be applied.

*(Note: Some snippet descriptions are placeholders and will be updated as the content is reviewed and refined.)*

## How to Use

1.  **Navigate** to the snippet you need within the repository (e.g., `shopify/setup-posthog-on-shopify.js`).
2.  **Copy** the code snippet.
3.  **Integrate** it into your website. The method will vary depending on the platform:
    *   **Shopify**: You can typically add JavaScript snippets by editing your theme's code. Go to `Online Store` > `Themes` > `Actions` (for your current theme) > `Edit code`. You might place scripts in `theme.liquid` (for sitewide scripts before the closing `</body>` tag), or create a new snippet under the `Snippets` folder and include it in `theme.liquid`.
    *   **WordPress**: You can add scripts via a plugin that allows custom code insertion (e.g., "Insert Headers and Footers"), by editing your theme's `functions.php` file (for enqueuing scripts), or directly in theme template files (less recommended for theme updates).
    *   **Google Tag Manager (GTM)**: For many platforms, you can use GTM to deploy custom HTML tags containing your JavaScript.
4.  **Configure** the snippet according to the comments within the code. This often involves setting your PostHog API key, project ID, feature flag keys, or specific CSS selectors for A/B testing.
5.  **Test** thoroughly to ensure the snippet is working as expected.

## Contributing

We welcome contributions! If you have a new snippet to share, an improvement to an existing one, or a bug fix, please follow these steps:

1.  **Fork** the repository.
2.  **Create a new branch** for your feature or fix (e.g., `git checkout -b feat/new-shopify-snippet` or `fix/readme-typo`).
3.  **Make your changes.** Ensure your code is well-commented and follows the existing style where possible. If adding a new snippet, please place it in the appropriate directory and update this README.
4.  **Test your changes** thoroughly.
5.  **Commit your changes** with a clear and descriptive commit message.
6.  **Push** your branch to your fork.
7.  **Submit a pull request** to the main repository.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details (a new LICENSE.md file will be added).

---

*This README is a work in progress and will be updated as the project is reorganized.*