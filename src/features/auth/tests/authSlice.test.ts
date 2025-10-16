// src/features/auth/tests/authSlice.test.ts

import reducer, { loginSuccess, logout } from '../authSlice';
import type { AuthState, User } from '../authTypes';

describe('authSlice', () => {
    const initialState: AuthState = {
        user: null,
        isAuthenticated: false,
    };

    it('should return the initial state', () => {
        const result = reducer(undefined, { type: '' });
        expect(result).toEqual(initialState);
    });

    it('should handle loginSuccess', () => {
        const mockUser: User = { id: '1', name: 'Milton', email: 'test@example.com' };
        const result = reducer(initialState, loginSuccess(mockUser));
        expect(result.user).toEqual(mockUser);
        expect(result.isAuthenticated).toBe(true);
    });

    it('should handle logout', () => {
        const loggedInState: AuthState = {
            user: { id: '1', name: 'Milton', email: 'test@example.com' },
            isAuthenticated: true,
        };

        const result = reducer(loggedInState, logout());
        expect(result.user).toBeNull();
        expect(result.isAuthenticated).toBe(false);
    });
});
