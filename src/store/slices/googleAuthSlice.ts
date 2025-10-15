import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initGapi, initGoogleIdentity, signInWithGoogle, signOutGoogle } from '@/lib/googleAuth';
interface GoogleUser {
    id: string;
    name: string;
    email: string;
    image: string;
    access_token?: string;
}

interface GoogleAuthState {
    user: GoogleUser | null;
    status: 'idle' | 'loading' | 'authenticated' | 'error';
    error?: string;
}

const initialState: GoogleAuthState = {
    user: null,
    status: 'idle',
};

export const initializeGapi = createAsyncThunk('googleAuth/init', async () => {
    console.log('🧩 Initializing Google APIs...');
    await initGapi();
    await initGoogleIdentity();
    return null;
});

export const googleSignIn = createAsyncThunk(
    'googleAuth/signIn',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔹 Opening Google Sign-In popup...');
            const profile = await signInWithGoogle();
            console.log('✅ Login successful for:', profile.name);

            return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                image: profile.image,
                access_token: profile.access_token,
            } as GoogleUser;
        } catch (error: any) {
            console.error('❌ Google Sign-In failed:', error);
            return rejectWithValue(error.message || 'Sign-in failed');
        }
    }
);

export const googleSignOut = createAsyncThunk('googleAuth/signOut', async () => {
    console.log('🔹 Signing out...');
    await signOutGoogle();
    console.log('✅ Sign-out complete');
});

const googleAuthSlice = createSlice({
    name: 'googleAuth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializeGapi.fulfilled, (state) => {
                state.status = 'idle';
            })
            // Sign-in flow
            .addCase(googleSignIn.pending, (state) => {
                state.status = 'loading';
                state.error = undefined;
            })
            .addCase(googleSignIn.fulfilled, (state, action: PayloadAction<GoogleUser>) => {
                state.user = action.payload;
                state.status = 'authenticated';
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload as string;
            })
            // Sign-out flow
            .addCase(googleSignOut.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    },
});

export default googleAuthSlice.reducer;
