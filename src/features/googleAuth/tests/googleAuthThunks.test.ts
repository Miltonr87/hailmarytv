import { googleSignIn, googleSignOut } from '../googleAuthThunks';
import { signInWithGoogle, signOutGoogle } from '@/lib/googleAuth';

jest.mock('@/lib/googleAuth', () => ({
    signInWithGoogle: jest.fn(),
    signOutGoogle: jest.fn(),
}));

describe('googleAuthThunks', () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn();
    const mockExtra = undefined;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fulfill when signInWithGoogle succeeds', async () => {
        const mockUser = { name: 'Milton', email: 'test@example.com' };
        (signInWithGoogle as jest.Mock).mockResolvedValueOnce(mockUser);

        const thunk = googleSignIn();
        const result = await thunk(mockDispatch, mockGetState, mockExtra);

        expect(signInWithGoogle).toHaveBeenCalled();
        expect(result.payload).toEqual(mockUser);
        expect(result.type).toBe('googleAuth/signIn/fulfilled');
    });

    it('should reject when signInWithGoogle throws an error', async () => {
        (signInWithGoogle as jest.Mock).mockRejectedValueOnce(new Error('Auth failed'));

        const thunk = googleSignIn();
        const result = await thunk(mockDispatch, mockGetState, mockExtra);

        expect(result.type).toBe('googleAuth/signIn/rejected');
        expect(result.payload).toBe('Auth failed');
    });

    it('should fulfill when signOutGoogle succeeds', async () => {
        (signOutGoogle as jest.Mock).mockResolvedValueOnce(true);

        const thunk = googleSignOut();
        const result = await thunk(mockDispatch, mockGetState, mockExtra);

        expect(signOutGoogle).toHaveBeenCalled();
        expect(result.type).toBe('googleAuth/signOut/fulfilled');
        expect(result.payload).toBe(true);
    });

    it('should reject when signOutGoogle throws an error', async () => {
        (signOutGoogle as jest.Mock).mockRejectedValueOnce(new Error('Logout failed'));

        const thunk = googleSignOut();
        const result = await thunk(mockDispatch, mockGetState, mockExtra);

        expect(result.type).toBe('googleAuth/signOut/rejected');
        expect(result.payload).toBe('Logout failed');
    });
});
