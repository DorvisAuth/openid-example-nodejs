# Dorvis OpenID Connect Demo

A simple Node.js demonstration application showing how to integrate [Dorvis](https://dorvis.eu) authentication hub with OpenID Connect.

## Quick Start

### Prerequisites

- **Node.js** 24+ (or **Bun** 1.3+)
- **Dorvis client credentials** (see setup below)

### 1. Setup Dorvis Client

1. Visit the [Dorvis platform](https://dorvis.eu) and create a new client
2. Configure your client with these settings:
   - **Redirect URI**: `http://localhost:3000/callback`
   - **Grant Types**: Authorization Code
   - **Scopes**: `openid`, `profile` (default)
3. Save your **Client ID** and **Client Secret** for the next step

### 2. Environment Configuration

Copy the environment configuration from example.

   ```bash
   cp .env.example .env
   ```

`.env.example` contains working configuration against Demo environment. See [Configuration options](#configuration-options) to configure for production use.



### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The application will start at <http://localhost:3000>

> Dependencies, tests, and the build run with [Bun](https://bun.sh): `bun install`, `bun test`, `bun run build`.

## How to Use

### Standard Authentication Flow

1. Click **"Sign in via Dorvis Platform"** on the home page
2. You'll be redirected to Dorvis where you can choose your identity provider
3. Complete authentication with your chosen provider
4. You'll be redirected back to see your authentication details

### Direct Provider Selection (Demo Feature)

1. Click any of the **"Sign in directly with [Provider]"** buttons
2. You'll be taken directly to that provider, bypassing Dorvis selection
3. This demonstrates the `acr_values` parameter functionality

## Configuration Options

| Variable | Description | Demo Value | Production Value |
|----------|-------------|------------|------------------|
| `OIDC_ISSUER_URL` | Dorvis OIDC endpoint | `https://demo.dorvis.eu/oidc` | `https://dorvis.eu/oidc` |
| `OIDC_CLIENT_ID` | Your Dorvis client ID | `dorvis_demo_post` | `your-client-id` |
| `OIDC_CLIENT_SECRET` | Your Dorvis client secret | `dorvis_demo_secret` | `your-secret` |
| `OIDC_REDIRECT_URL` | Callback URL after authentication<br>(must be whitelisted in Dorvis) | `http://localhost:3000/callback` | `https://your-domain.com/callback` |
| `ACR_VALUES` | Comma-separated identity providers<br>to show on login page | `Swedbank,Seb,Luminor,`<br>`Citadele,eParaksts,`<br>`eParaksts-mobile,Smartid` | `Swedbank,Seb,Luminor,`<br>`Citadele,eParaksts,`<br>`eParaksts-mobile,Smartid` |
| `PORT` | Server port | `3000` | `3000` |

## Learn More

- [More about Dorvis](https://dorvis.eu)
- [OpenID Connect Specification](https://openid.net/connect/)
- [Passport.js OpenID Connect Strategy](https://www.passportjs.org/packages/passport-openidconnect/)