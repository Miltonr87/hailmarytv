import reducer from '../googleAuthSlice';
import { googleSignIn, googleSignOut } from '../googleAuthThunks';

jest.mock('../googleAuthThunks', () => ({
    googleSignIn: { pending: { type: 'googleAuth/signIn/pending' }, fulfilled: { type: 'googleAuth/signIn/fulfilled' }, rejected: { type: 'googleAuth/signIn/rejected' } },
    googleSignOut: { pending: { type: 'googleAuth/signOut/pending' }, fulfilled: { type: 'googleAuth/signOut/fulfilled' }, rejected: { type: 'googleAuth/signOut/rejected' } },
}));

describe('googleAuthSlice (mocked)', () => {
    const initialState = {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    };

    it('should return the initial state', () => {
        const result = reducer(undefined, { type: '' });
        expect(result).toEqual(initialState);
    });

    it('should handle googleSignIn.pending', () => {
        const action = { type: googleSignIn.pending.type };
        const result = reducer(initialState, action);
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
    });

    it('should handle googleSignIn.fulfilled', () => {
        const mockUser = { name: 'Milton', email: 'test@example.com' };
        const action = { type: googleSignIn.fulfilled.type, payload: mockUser };
        const result = reducer(initialState, action);
        expect(result.user).toEqual(mockUser);
        expect(result.isAuthenticated).toBe(true);
        expect(result.loading).toBe(false);
    });

    it('should handle googleSignIn.rejected', () => {
        const action = { type: googleSignIn.rejected.type, payload: 'Sign-in error' };
        const result = reducer(initialState, action);
        expect(result.error).toBe('Sign-in error');
        expect(result.isAuthenticated).toBe(false);
        expect(result.loading).toBe(false);
    });

    it('should handle googleSignOut.fulfilled', () => {
        const signedInState = {
            ...initialState,
            user: { name: 'Milton' },
            isAuthenticated: true,
        };
        const action = { type: googleSignOut.fulfilled.type };
        const result = reducer(signedInState, action);
        expect(result.user).toBeNull();
        expect(result.isAuthenticated).toBe(false);
    });

    it('should handle googleSignOut.rejected', () => {
        const action = { type: googleSignOut.rejected.type, payload: 'Sign-out error' };
        const result = reducer(initialState, action);
        expect(result.error).toBe('Sign-out error');
        expect(result.loading).toBe(false);
    });
});
