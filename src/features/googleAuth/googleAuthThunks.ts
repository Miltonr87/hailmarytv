import { createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle, signOutGoogle } from '@/lib/googleAuth';
import { GoogleUser } from './googleAuthTypes';

export const googleSignIn = createAsyncThunk<GoogleUser, void, { rejectValue: string }>(
    'googleAuth/signIn',
    async (_, { rejectWithValue }) => {
        try {
            const user = await signInWithGoogle();
            return user;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Google Sign-In failed';
            console.error('⚠️ Google Sign-In failed:', err);
            return rejectWithValue(message);
        }
    }
);

export const googleSignOut = createAsyncThunk<boolean, void, { rejectValue: string }>(
    'googleAuth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await signOutGoogle();
            return true;
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : 'Google Sign-Out failed';
            console.error('⚠️ Google Sign-Out failed:', err);
            return rejectWithValue(message);
        }
    }
);
