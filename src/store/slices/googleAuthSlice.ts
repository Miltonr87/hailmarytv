import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { initGapi, signInWithGoogle, signOutGoogle, getCurrentUser } from '@/lib/googleAuth';

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

export const initializeGapi = createAsyncThunk('googleAuth/init', async () => {
    console.log('🧩 Initializing Google API client...');
    await initGapi();
    const profile = getCurrentUser();
    if (!profile) return null;
    return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        image: profile.getImageUrl(),
    } as GoogleUser;
});

export const googleSignIn = createAsyncThunk('googleAuth/signIn', async (_, { rejectWithValue }) => {
    try {
        if (!(window as any).gapi?.auth2) {
            console.warn('⚠️ gapi.auth2 not ready, initializing...');
            await initGapi();
        }

        console.log('🔹 Opening Google Sign-In popup...');
        const profile = await signInWithGoogle();
        console.log('✅ Login successful for:', profile.getName());

        return {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            image: profile.getImageUrl(),
        } as GoogleUser;
    } catch (error: any) {
        console.error('❌ Google Sign-In failed:', error);
        return rejectWithValue(error.message || 'Sign-in failed');
    }
});

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
            .addCase(initializeGapi.fulfilled, (state, action) => {
                state.user = action.payload;
                state.status = action.payload ? 'authenticated' : 'idle';
            })
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
            .addCase(googleSignOut.fulfilled, (state) => {
                state.user = null;
                state.status = 'idle';
            });
    },
});

export default googleAuthSlice.reducer;
