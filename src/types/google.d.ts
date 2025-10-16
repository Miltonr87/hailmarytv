declare namespace google {
    namespace accounts {
        namespace oauth2 {
            interface TokenClientConfig {
                client_id: string;
                scope: string;
                callback: (tokenResponse: TokenResponse) => void;
            }

            interface TokenClient {
                requestAccessToken: (options?: { prompt?: string }) => void;
            }

            interface TokenResponse {
                access_token: string;
                expires_in: number;
                error?: string;
                token_type?: string;
                scope?: string;
            }

            function initTokenClient(config: TokenClientConfig): TokenClient;
        }

        namespace id {
            function disableAutoSelect(): void;
        }
    }
}
