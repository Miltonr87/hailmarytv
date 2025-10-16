import { createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithGoogle, signOutGoogle } from '@/lib/googleAuth';
import type { GoogleUser } from './googleAuthTypes';

export const googleSignIn = createAsyncThunk<GoogleUser>(
    'googleAuth/signIn',
    async (_, { rejectWithValue }) => {
        try {
            const user = await signInWithGoogle();
            return user;
        } catch (err: any) {
            console.error('⚠️ Google Sign-In failed:', err);
            return rejectWithValue(err.message || 'Google Sign-In failed');
        }
    }
);

export const googleSignOut = createAsyncThunk(
    'googleAuth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await signOutGoogle();
            return true;
        } catch (err: any) {
            console.error('⚠️ Google Sign-Out failed:', err);
            return rejectWithValue(err.message || 'Google Sign-Out failed');
        }
    }
);
