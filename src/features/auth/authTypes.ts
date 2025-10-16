export interface User {
    name: string;
    email: string;
    picture: string;
    accessToken: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
