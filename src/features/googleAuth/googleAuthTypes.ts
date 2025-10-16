export interface GoogleUser {
    id: string;
    name: string;
    email: string;
    image: string;
    access_token: string;
}

export interface GoogleAuthState {
    user: GoogleUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}
