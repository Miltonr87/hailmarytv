import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { MOCK_VIDEOS } from '@/data/mockVideos';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
}

interface VideosState {
  featured: Video[];
  teamVideos: Record<string, Video[]>;
  loading: boolean;
  error: string | null;
}

const initialState: VideosState = {
  featured: [],
  teamVideos: {},
  loading: false,
  error: null,
};

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setFeaturedVideos: (state, action: PayloadAction<Video[]>) => {
      state.featured = action.payload;
      state.loading = false;
    },
    setTeamVideos: (state, action: PayloadAction<{ team: string; videos: Video[] }>) => {
      state.teamVideos[action.payload.team] = action.payload.videos;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setFeaturedVideos, setTeamVideos, setError } = videosSlice.actions;

// Thunk actions
export const fetchFeaturedVideos = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  
  // Simulate API delay
  setTimeout(() => {
    dispatch(setFeaturedVideos(MOCK_VIDEOS));
  }, 500);
};

export const fetchTeamVideos = (teamName: string, searchQuery: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  
  // Simulate API delay and return shuffled mock videos
  setTimeout(() => {
    const shuffled = [...MOCK_VIDEOS].sort(() => Math.random() - 0.5);
    dispatch(setTeamVideos({ team: teamName, videos: shuffled }));
  }, 500);
};

export default videosSlice.reducer;
