import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFeaturedVideos, fetchVideosBySearch, fetchTeamVideos } from './videosThunks';
import { Video } from './videosTypes';

interface VideosState {
    featured: Video[];
    teamVideos: Record<string, Video[]>;
    searchHistory: string[];
    loading: boolean;
    error: string | null;
}

const initialState: VideosState = {
    featured: [],
    teamVideos: {},
    searchHistory: [],
    loading: false,
    error: null,
};

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        addSearchHistory: (state, action: PayloadAction<string>) => {
            const existing = state.searchHistory.filter((t) => t !== action.payload);
            state.searchHistory = [action.payload, ...existing].slice(0, 10);
            localStorage.setItem('search_history', JSON.stringify(state.searchHistory));
        },
        loadSearchHistoryState: (state) => {
            try {
                const saved = JSON.parse(localStorage.getItem('search_history') || '[]');
                state.searchHistory = saved;
            } catch {
                state.searchHistory = [];
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeaturedVideos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFeaturedVideos.fulfilled, (state, action) => {
                state.featured = action.payload;
                state.loading = false;
            })
            .addCase(fetchVideosBySearch.fulfilled, (state, action) => {
                state.featured = action.payload;
                state.loading = false;
            })
            .addCase(fetchTeamVideos.fulfilled, (state, action) => {
                const { teamName } = action.meta.arg;
                state.teamVideos[teamName] = action.payload;
                state.loading = false;
            })
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.error?.message || 'Error fetching videos';
                }
            );
    },
});

export const { addSearchHistory, loadSearchHistoryState } = videosSlice.actions;
export default videosSlice.reducer;
