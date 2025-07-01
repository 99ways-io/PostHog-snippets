
// PostHog Configuration Validator
class PostHogValidator {
  static validateConfig(apiKey, apiHost, featureFlagKey) {
    const errors = [];
    
    if (!apiKey || apiKey === 'YOUR_POSTHOG_PROJECT_API_KEY') {
      errors.push('PostHog API key not configured');
    }
    
    if (!apiHost || !apiHost.startsWith('https://')) {
      errors.push('Invalid PostHog API host');
    }
    
    if (featureFlagKey && featureFlagKey === 'YOUR_FEATURE_FLAG_KEY') {
      errors.push('Feature flag key not configured');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }
  
  static validateElements(selectors) {
    const missing = [];
    
    selectors.forEach(selector => {
      if (!document.querySelector(selector)) {
        missing.push(selector);
      }
    });
    
    return {
      valid: missing.length === 0,
      missing: missing
    };
  }
  
  static logValidation(validation, context = '') {
    if (validation.valid) {
      console.log(`✅ ${context} validation passed`);
    } else {
      console.warn(`❌ ${context} validation failed:`, validation.errors || validation.missing);
    }
  }
}

// Usage example:
// const configValidation = PostHogValidator.validateConfig(apiKey, apiHost, featureFlagKey);
// PostHogValidator.logValidation(configValidation, 'PostHog Configuration');
