import type { Middleware, RequestContext, ResponseContext, FetchAPI } from './generated/runtime';

export interface TokenState {
  accessToken: string;
  refreshToken?: string;
  clientId?: string;
}

export interface AuthMiddlewareOptions {
  tokenState: TokenState;
  basePath: string;
  fetchApi?: FetchAPI;
  onTokenRefreshed?: (accessToken: string, refreshToken: string) => void;
}

/**
 * Fetch middleware that adds Bearer token and handles automatic refresh on 401.
 *
 * When a request returns 401 and refreshToken + clientId are present,
 * the middleware calls POST /api/apps/oauth/token with grant_type=refresh_token,
 * updates tokens, and retries the original request once.
 */
export function createAuthMiddleware(options: AuthMiddlewareOptions): Middleware {
  const { tokenState, basePath, onTokenRefreshed } = options;
  const fetchFn = options.fetchApi ?? fetch;
  let refreshPromise: Promise<void> | null = null;

  return {
    pre: async (context: RequestContext): Promise<RequestContext> => {
      const headers = new Headers(context.init.headers);
      headers.set('Authorization', `Bearer ${tokenState.accessToken}`);
      context.init.headers = headers;
      return context;
    },

    post: async (context: ResponseContext): Promise<Response> => {
      if (context.response.status !== 401 || !tokenState.refreshToken || !tokenState.clientId) {
        return context.response;
      }

      if (!refreshPromise) {
        refreshPromise = performRefresh(tokenState, basePath, fetchFn, onTokenRefreshed)
          .finally(() => { refreshPromise = null; });
      }

      try {
        await refreshPromise;
      } catch {
        return context.response;
      }

      const retryHeaders = new Headers(context.init.headers);
      retryHeaders.set('Authorization', `Bearer ${tokenState.accessToken}`);
      return fetchFn(context.url, { ...context.init, headers: retryHeaders });
    },
  };
}

async function performRefresh(
  tokenState: TokenState,
  basePath: string,
  fetchFn: FetchAPI,
  onTokenRefreshed?: (accessToken: string, refreshToken: string) => void,
): Promise<void> {
  const response = await fetchFn(`${basePath}/api/apps/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: tokenState.clientId,
      refresh_token: tokenState.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data: { access_token: string; refresh_token: string } = await response.json();
  tokenState.accessToken = data.access_token;
  tokenState.refreshToken = data.refresh_token;
  onTokenRefreshed?.(data.access_token, data.refresh_token);
}
