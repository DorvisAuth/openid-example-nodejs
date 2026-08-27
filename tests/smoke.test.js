import { test, expect } from 'bun:test';

// Smoke test: with valid config the app module loads (client.discovery with mock fetch)
// and exposes an Express app. Catches broken imports/config.
test('app boots with valid config', async () => {
  process.env.OIDC_ISSUER_URL = 'https://example.test/oidc';
  process.env.OIDC_CLIENT_ID = 'test-client';
  process.env.OIDC_CLIENT_SECRET = 'test-secret';
  process.env.OIDC_REDIRECT_URL = 'http://localhost:3000/callback';
  process.env.PROVIDERS = 'Swedbank,Seb';

  global.fetch = async () => new Response(JSON.stringify({
    issuer: 'https://example.test/oidc',
    authorization_endpoint: 'https://example.test/oidc/authorize',
    token_endpoint: 'https://example.test/oidc/token',
    userinfo_endpoint: 'https://example.test/oidc/userinfo',
    jwks_uri: 'https://example.test/oidc/jwks',
  }));

  const app = (await import('../app.js')).default;

  expect(typeof app.listen).toBe('function');
});
