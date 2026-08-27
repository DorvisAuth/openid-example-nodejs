import express from 'express';
import ejs from 'ejs';
import path from 'path';
import crypto from 'crypto';
import session from 'express-session';
import * as client from 'openid-client';

for (const key of ['OIDC_ISSUER_URL', 'OIDC_CLIENT_ID', 'OIDC_CLIENT_SECRET', 'OIDC_REDIRECT_URL']) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable ${key}. Copy .env.example to .env and fill it in.`);
  }
}

const app = express();

const PROVIDERS = (process.env.PROVIDERS || '').split(',').filter(Boolean);

const config = await client.discovery(new URL(process.env.OIDC_ISSUER_URL), process.env.OIDC_CLIENT_ID, process.env.OIDC_CLIENT_SECRET)

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: 'auto', sameSite: 'lax' },
}));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(process.cwd(), 'templates'));

app.get('/login', async (req, res) => {
  const code_verifier = client.randomPKCECodeVerifier();
  const code_challenge = await client.calculatePKCECodeChallenge(code_verifier);
  const state = client.randomState();
  const nonce = client.randomNonce();

  req.session.oidc = { code_verifier, state, nonce };

  const params = {
    redirect_uri: process.env.OIDC_REDIRECT_URL,
    scope: 'openid profile',
    code_challenge,
    code_challenge_method: 'S256',
    state,
    nonce,
  };

  if (req.query.acr_values) {
    params.acr_values = req.query.acr_values;
  }

  res.redirect(client.buildAuthorizationUrl(config, params).href);
});

app.get('/logout', function (req, res) {
  const idToken = req.session.user?.idToken;

  req.session.destroy(function () {
    if (!idToken || !config.serverMetadata().end_session_endpoint) {
      return res.redirect('/');
    }

    const endSessionUrl = client.buildEndSessionUrl(config, {
      id_token_hint: idToken,
      post_logout_redirect_uri: `${req.protocol}://${req.get('host')}`,
    });
    res.redirect(endSessionUrl.href);
  });
});

app.get('/', function (req, res) {
  res.render('login.html', {
    providers: PROVIDERS,
  });
});

app.get('/callback', async (req, res) => {
  if (!req.session.oidc){
    return res.status(400).render('error.html', {
      Error: 'Your login session expired. Please start again.',
      LoginUrl: '/'
    });
  }
  const { code_verifier, state, nonce } = req.session.oidc;
  delete req.session.oidc;
  const currentUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

  let tokens;
  try {
    tokens = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: code_verifier,
      expectedState: state,
      expectedNonce: nonce,
    });
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(400).render('error.html', {
      Error: err.error || err.message || 'Authentication error occurred',
      LoginUrl: '/'
    });
  }

  const claims = tokens.claims();
  const user = {
    name: {
      givenName: claims.given_name,
      familyName: claims.family_name,
    },
    person_code: claims.person_code,
    idToken: tokens.id_token,
  };

  req.session.user = user;

  res.render('callback.html', {
    user: user
  });
});

// Last-resort handler so an unexpected throw renders the error page instead of
// leaking a stack trace to the browser.
app.use(function (err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).render('error.html', {
    Error: 'An unexpected error occurred.',
    LoginUrl: '/',
  });
});

export default app;

if (import.meta.main) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`);
  });
}
