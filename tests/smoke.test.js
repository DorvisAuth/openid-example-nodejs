import { test, expect } from 'bun:test';

// Smoke test: with valid config the app module loads (imports + OIDC strategy
// wiring resolve) and exposes an Express app. Catches broken imports/config.
test('app boots with valid config', async () => {
  process.env.OIDC_ISSUER_URL = 'https://example.test/oidc';
  process.env.OIDC_CLIENT_ID = 'test-client';
  process.env.OIDC_CLIENT_SECRET = 'test-secret';
  process.env.OIDC_REDIRECT_URL = 'http://localhost:3000/callback';
  process.env.ACR_VALUES = 'Swedbank,Seb';

  const app = (await import('../app.js')).default;

  expect(typeof app.listen).toBe('function');
});
