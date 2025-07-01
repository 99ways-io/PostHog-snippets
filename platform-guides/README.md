
# Platform-Specific Implementation Guides

## ClickFunnels
- Add snippets to the "Custom JS/HTML" section in page settings
- Use the "Before </body> tag" option for PostHog installation
- Test in preview mode before publishing

## WordPress
- Use a plugin like "Insert Headers and Footers" for site-wide installation
- For page-specific tests, add to individual page/post custom fields
- Consider caching plugins when testing - may need to clear cache

## Shopify
- Add PostHog installation to `theme.liquid` before `</head>`
- A/B test scripts can go in section or template files
- Test in theme preview before making live

## Common Issues
1. **Script loading order**: PostHog must load before A/B test scripts
2. **Element timing**: Ensure elements exist before applying modifications
3. **Caching**: Clear platform caches when testing changes
4. **Mobile testing**: Always test on mobile devices

## Testing Checklist
- [ ] PostHog events appear in dashboard
- [ ] Feature flags load correctly
- [ ] All variants display properly
- [ ] Console shows no errors
- [ ] Mobile compatibility confirmed
