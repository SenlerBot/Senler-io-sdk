"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = createAuthMiddleware;
/**
 * Fetch middleware that adds Bearer token and handles automatic refresh on 401.
 *
 * When a request returns 401 and refreshToken + clientId are present,
 * the middleware calls POST /api/apps/oauth/token with grant_type=refresh_token,
 * updates tokens, and retries the original request once.
 */
function createAuthMiddleware(options) {
    const { tokenState, basePath, onTokenRefreshed } = options;
    const fetchFn = options.fetchApi ?? fetch;
    let refreshPromise = null;
    return {
        pre: async (context) => {
            const headers = new Headers(context.init.headers);
            headers.set('Authorization', `Bearer ${tokenState.accessToken}`);
            context.init.headers = headers;
            return context;
        },
        post: async (context) => {
            if (context.response.status !== 401 || !tokenState.refreshToken || !tokenState.clientId) {
                return context.response;
            }
            if (!refreshPromise) {
                refreshPromise = performRefresh(tokenState, basePath, fetchFn, onTokenRefreshed)
                    .finally(() => { refreshPromise = null; });
            }
            try {
                await refreshPromise;
            }
            catch {
                return context.response;
            }
            const retryHeaders = new Headers(context.init.headers);
            retryHeaders.set('Authorization', `Bearer ${tokenState.accessToken}`);
            return fetchFn(context.url, { ...context.init, headers: retryHeaders });
        },
    };
}
async function performRefresh(tokenState, basePath, fetchFn, onTokenRefreshed) {
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
    const data = await response.json();
    tokenState.accessToken = data.access_token;
    tokenState.refreshToken = data.refresh_token;
    onTokenRefreshed?.(data.access_token, data.refresh_token);
}
