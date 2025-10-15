import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videosReducer from './slices/videosSlice';
import googleAuthReducer from './slices/googleAuthSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videosReducer,
    googleAuth: googleAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
