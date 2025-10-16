import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import videosReducer from '@/features/videos/videosSlice';
import googleAuthReducer from '@/features/googleAuth/googleAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    googleAuth: googleAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
