import type { Middleware, FetchAPI } from './generated/runtime';
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
export declare function createAuthMiddleware(options: AuthMiddlewareOptions): Middleware;
