# Vercel Web Analytics Setup

This project has been configured with Vercel Web Analytics to track user interactions and Core Web Vitals.

## What's Configured

### 1. Plain HTML Integration
Both `index.html` and `dashboard.html` include the Vercel Web Analytics script tag:
```html
<script defer src="/_vercel/insights/script.js"></script>
```

This script automatically:
- Tracks page views
- Measures Core Web Vitals (CLS, FID/INP, LCP)
- Records navigation timing
- Enables custom event tracking

### 2. Package Dependencies
The `@vercel/analytics` package is installed and available for framework-specific usage:
```bash
npm install @vercel/analytics
```

### 3. Optional Client-Side Integration
The `analytics.js` file provides a utility function for frameworks that need explicit initialization:
```javascript
import { initAnalytics } from './analytics.js';
initAnalytics();
```

Or directly import from the package:
```javascript
import { inject } from '@vercel/analytics';
inject();
```

## How It Works

### For Plain HTML Sites
The Vercel Web Analytics script loads automatically from `/_vercel/insights/script.js` when deployed on Vercel. This endpoint is provided by Vercel and does not require additional configuration.

### For Framework Integration
If you add a framework like React, Vue, or Next.js, you can use:
```javascript
import { inject } from '@vercel/analytics';

// Call once on app initialization
inject();
```

## Vercel Deployment
When deployed to Vercel, the analytics dashboard automatically appears in your Vercel project settings. No additional configuration is needed - the script tag handles everything.

## Data Collection
Vercel Web Analytics collects:
- **Page Views**: Tracked automatically
- **Core Web Vitals**: Cumulative Layout Shift (CLS), Interaction to Next Paint (INP), Largest Contentful Paint (LCP)
- **Navigation Timing**: Page load performance metrics
- **Custom Events**: Optional, can be added programmatically

## Privacy
- No cookies are used
- Data collection is privacy-friendly and GDPR compliant
- No personal data is collected

## Documentation
For more details, see: https://vercel.com/docs/analytics
