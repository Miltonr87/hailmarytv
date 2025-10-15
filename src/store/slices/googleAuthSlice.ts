import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initGapi, initGoogleIdentity, signInWithGoogle, signOutGoogle } from '@/lib/googleAuth';

interface GoogleUser {
    id: string;
    name: string;
    email: string;
    image: string;
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

/**
 * ✅ Initialize both GAPI (for YouTube) and Google Identity (for login)
 */
export const initializeGapi = createAsyncThunk('googleAuth/init', async () => {
    console.log('🧩 Initializing Google APIs...');
    await initGapi();
    await initGoogleIdentity();
    return null; // GIS doesn’t auto-restore sessions
});

/**
 * ✅ Sign in via Google Identity Services
 */
export const googleSignIn = createAsyncThunk(
    'googleAuth/signIn',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔹 Opening Google Sign-In popup...');
            const profile = await signInWithGoogle(); // returns JSON { id, name, email, image }
            console.log('✅ Login successful for:', profile.name);

            return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                image: profile.image,
            } as GoogleUser;
        } catch (error: any) {
            console.error('❌ Google Sign-In failed:', error);
            return rejectWithValue(error.message || 'Sign-in failed');
        }
    }
);

/**
 * ✅ Sign out (revokes token + disables auto-select)
 */
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
            // Init
            .addCase(initializeGapi.fulfilled, (state) => {
                state.status = 'idle';
            })

            // Sign-In flow
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

            // Sign-Out flow
            .addCase(googleSignOut.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    },
});

export default googleAuthSlice.reducer;
