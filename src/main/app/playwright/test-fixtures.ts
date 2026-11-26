import { test as base, expect } from '@playwright/test';

/**
 * Playwright `test` with an automatic fixture that blocks every request leaving the
 * test server. Mocks registered with `page.route` take precedence over this
 * context-level catch-all, so only unmocked external requests end up here. Tests
 * fail if any such request was made, listing the offending URLs.
 */
export const test = base.extend<{ blockExternalRequests: void }>({
  blockExternalRequests: [
    async ({ context, baseURL }, use) => {
      const allowedOrigin = new URL(baseURL!).origin;
      const blocked: Array<string> = [];

      await context.route('**/*', (route) => {
        const url = route.request().url();
        if (url.startsWith(allowedOrigin)) {
          return route.fallback();
        }
        blocked.push(url);
        return route.abort('blockedbyclient');
      });

      await use();

      expect(blocked, 'Unmocked external requests were made').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
