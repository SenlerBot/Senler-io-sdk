# @aisenler/sdk-fetch

Ai Senler API SDK — fetch edition.

Auto-generated from OpenAPI specification.

## Installation

```bash
npm install @aisenler/sdk-fetch
```

## Quick Start

```typescript
import { AiSenlerClient } from '@aisenler/sdk-fetch';

const client = new AiSenlerClient({
  accessToken: 'your_api_key',
});

// All resources are available as properties
const agents = await client.agents.getAgents();
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
