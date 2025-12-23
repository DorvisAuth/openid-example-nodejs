# Dorvis OpenID Connect Demo

A simple Node.js demonstration application showing how to integrate [Dorvis](https://dorvis.eu) authentication hub with OpenID Connect.

## Quick Start

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** package manager
- **Dorvis client credentials** (see setup below)

### 1. Setup Dorvis Client

1. Visit the [Dorvis platform](https://dorvis.eu) and create a new client
2. Configure your client with these settings:
   - **Redirect URI**: `http://localhost:3000/callback`
   - **Grant Types**: Authorization Code
   - **Scopes**: `openid`, `profile` (default)
3. Save your **Client ID** and **Client Secret** for the next step

### 2. Environment Configuration

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

   .env.example contains working configuration against Demo environment. See [Configuration options](#configuration-options) to configure for production use.

2. Edit `.env` with your Dorvis credentials:

   ```dotenv
   OIDC_ISSUER_URL=https://dorvis.eu/oidc
   OIDC_CLIENT_ID=your-client-id-here
   OIDC_CLIENT_SECRET=your-client-secret-here
   OIDC_REDIRECT_URL=http://localhost:3000/callback
   ACR_VALUES=Swedbank,Seb,Luminor,Citadele,eParaksts,eParaksts-mobile,Smartid
   ```

   > **Tip**: The `ACR_VALUES` define which identity providers will be available for direct selection in the demo.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm start
```

The application will start at <http://localhost:3000>

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

| Variable | Description | Demo Value | Production Example |
|----------|-------------|------------|-------------------|
| `OIDC_ISSUER_URL` | Dorvis OIDC endpoint | `https://demo.dorvis.eu/oidc` | `https://dorvis.eu/oidc` |
| `OIDC_CLIENT_ID` | Your Dorvis client ID | `dorvis_demo_post` | `your-client-id` |
| `OIDC_CLIENT_SECRET` | Your Dorvis client secret | `dorvis_demo_secret` | `your-secret` |
| `OIDC_REDIRECT_URL` | Callback URL after authentication (must be whitelisted in Dorvis client portal)| `http://localhost:3000/callback` | `https://your-domain.com/callback` |
| `ACR_VALUES` | Comma-separated identity providers to show on login page | `Smartid` | `Swedbank,Seb,Luminor,Citadele,eParaksts,eParaksts-mobile,Smartid` |
| `PORT` | Server port | `3000` | `3000` |

## Learn More

- [More about Dorvis](https://dorvis.eu)
- [OpenID Connect Specification](https://openid.net/connect/)
- [Passport.js OpenID Connect Strategy](https://www.passportjs.org/packages/passport-openidconnect/)