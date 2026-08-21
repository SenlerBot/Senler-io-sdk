interface BaseClientConfig {
    /**
     * API access token (Bearer).
     * Obtained through the OAuth authorization_code flow.
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
     * OAuth client_secret — required for confidential-client token refresh.
     * Keep it on the server and never expose it to browser code.
     */
    clientSecret: string;
    /**
     * Callback fired after a successful token refresh.
     * Use it to persist the new tokens in your storage.
     */
    onTokenRefreshed?: (accessToken: string, refreshToken: string) => void | Promise<void>;
}
interface WithoutTokenRefresh {
    refreshToken?: undefined;
    clientId?: undefined;
    clientSecret?: undefined;
    onTokenRefreshed?: undefined;
}
/**
 * Either provide refreshToken + clientId + clientSecret for auto-refresh,
 * or omit all three. Partial configuration is a type error.
 */
export type AiSenlerClientConfig = BaseClientConfig & (WithTokenRefresh | WithoutTokenRefresh);
export {};
