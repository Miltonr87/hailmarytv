import { createSlice } from '@reduxjs/toolkit';
import { GoogleAuthState } from './googleAuthTypes';
import { googleSignIn, googleSignOut } from './googleAuthThunks';

const initialState: GoogleAuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
};

const googleAuthSlice = createSlice({
    name: 'googleAuth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 🔹 Sign-In
            .addCase(googleSignIn.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Google sign-in failed';
                state.user = null;
                state.isAuthenticated = false;
            })

            // 🔹 Sign-Out
            .addCase(googleSignOut.pending, (state) => {
                state.loading = true;
            })
            .addCase(googleSignOut.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(googleSignOut.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Google sign-out failed';
            });
    },
});

export default googleAuthSlice.reducer;
