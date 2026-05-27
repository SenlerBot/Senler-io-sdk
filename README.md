# @aisenler/sdk-fetch

Senler.io API SDK — fetch edition.

Auto-generated from OpenAPI specification.

API documentation: https://dev.senler.io

## Installation

Pin a version for reproducible installs:

```bash
npm install github:SenlerBot/Senler-io-sdk#v0.1.0
```

For the latest commit from `main`:

```bash
npm install github:SenlerBot/Senler-io-sdk
```

## Requirements

- Node.js 18+ or another runtime with global `fetch`.
- TypeScript declarations are included.

## Quick Start

```typescript
import { AiSenlerClient } from '@aisenler/sdk-fetch';

const client = new AiSenlerClient({
  accessToken: 'access_token',
});

const project = await client.projects.getMe();
```

All generated API groups are available as client properties. Method parameters are passed as one camelCase object:

```typescript
const agents = await client.agents.list({
  projectId: 'project_id',
  xSessionId: 'session_id',
  limit: 20,
});
```

## Token Refresh

If you use OAuth tokens with refresh support:

```typescript
const client = new AiSenlerClient({
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  clientId: 'your_client_id',
  onTokenRefreshed: (newAccess, newRefresh) => {
    // Persist the new tokens in your storage
    db.saveTokens(newAccess, newRefresh);
  },
});

// SDK automatically refreshes the token on 401 and retries the request
```

Auto-refresh is enabled only when both `refreshToken` and `clientId` are provided.

## Update Token Manually

```typescript
client.accessToken = 'new_token';
```

## Base URL

Default: `https://api.senler.io`

```typescript
const client = new AiSenlerClient({
  accessToken: 'token',
  baseUrl: 'https://custom.api.url',
});
```

## Errors

Non-2xx responses throw an error with the original `response` attached.
