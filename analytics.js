/**
 * Vercel Web Analytics Integration
 * 
 * This file provides optional client-side analytics for frameworks that support it.
 * For plain HTML sites, the analytics are automatically loaded via the script tag in the HTML head.
 * 
 * Usage in modern frameworks (React, Vue, etc.):
 * import { inject } from '@vercel/analytics';
 * inject();
 */

// Optional: For frameworks that need explicit initialization
if (typeof window !== 'undefined') {
  // The Vercel Web Analytics script is already loaded via the _vercel/insights/script.js tag
  // This provides automatic tracking of:
  // - Page views
  // - Navigation timing
  // - Core Web Vitals
  // - Custom events
  console.log('Vercel Web Analytics initialized');
}

// Export inject function for framework-specific usage
export async function initAnalytics() {
  try {
    // Dynamic import for @vercel/analytics if needed
    const { inject } = await import('@vercel/analytics');
    inject();
  } catch (error) {
    console.warn('Failed to initialize @vercel/analytics:', error);
  }
}
