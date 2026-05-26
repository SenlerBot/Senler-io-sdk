interface BaseClientConfig {
    /**
     * API access token (Bearer).
     * Obtained via POST /api/apps/oauth/token with grant_type=client_credentials
     * or through the OAuth authorization_code flow.
     */
    accessToken: string;
    /**
     * API base URL. Defaults to https://api.senler.io
     */
    baseUrl?: string;
}
interface WithTokenRefresh {
    /**
     * Refresh token for automatic token renewal.
     * When provided, the SDK will automatically refresh the access token
     * on 401 responses and retry the request.
     */
    refreshToken: string;
    /**
     * OAuth client_id — required for token refresh.
     */
    clientId: string;
    /**
     * Callback fired after a successful token refresh.
     * Use it to persist the new tokens in your storage.
     */
    onTokenRefreshed?: (accessToken: string, refreshToken: string) => void;
}
interface WithoutTokenRefresh {
    refreshToken?: undefined;
    clientId?: undefined;
    onTokenRefreshed?: undefined;
}
/**
 * Either provide both refreshToken + clientId for auto-refresh,
 * or omit both. Partial configuration is a type error.
 */
export type AiSenlerClientConfig = BaseClientConfig & (WithTokenRefresh | WithoutTokenRefresh);
export {};
