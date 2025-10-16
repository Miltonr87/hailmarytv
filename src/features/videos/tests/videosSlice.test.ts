import reducer, { addSearchHistory, loadSearchHistoryState } from '../videosSlice';
import { fetchFeaturedVideos, fetchVideosBySearch, fetchTeamVideos } from '../videosThunks';
import type { Video } from '../videosTypes';

jest.mock('../videosThunks', () => ({
    fetchFeaturedVideos: {
        pending: { type: 'videos/fetchFeaturedVideos/pending' },
        fulfilled: { type: 'videos/fetchFeaturedVideos/fulfilled' },
    },
    fetchVideosBySearch: {
        fulfilled: { type: 'videos/fetchVideosBySearch/fulfilled' },
    },
    fetchTeamVideos: {
        fulfilled: { type: 'videos/fetchTeamVideos/fulfilled' },
    },
}));

describe('videosSlice', () => {
    const initialState = {
        featured: [],
        teamVideos: {},
        searchHistory: [],
        loading: false,
        error: null,
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it('should return initial state', () => {
        const result = reducer(undefined, { type: '' });
        expect(result).toEqual(initialState);
    });

    it('should add search term to history and persist in localStorage', () => {
        const state = reducer(initialState, addSearchHistory('Raiders'));
        expect(state.searchHistory).toEqual(['Raiders']);
        const saved = JSON.parse(localStorage.getItem('search_history') || '[]');
        expect(saved).toEqual(['Raiders']);
    });

    it('should keep max 10 search items and remove duplicates', () => {
        const filledState = {
            ...initialState,
            searchHistory: Array.from({ length: 10 }, (_, i) => `term${i}`),
        };
        const result = reducer(filledState, addSearchHistory('term5'));
        expect(result.searchHistory[0]).toBe('term5');
        expect(result.searchHistory).toHaveLength(10);
    });

    it('should load search history from localStorage', () => {
        localStorage.setItem('search_history', JSON.stringify(['Cowboys']));
        const result = reducer(initialState, loadSearchHistoryState());
        expect(result.searchHistory).toEqual(['Cowboys']);
    });

    it('should handle fetchFeaturedVideos.pending', () => {
        const action = { type: fetchFeaturedVideos.pending.type };
        const result = reducer(initialState, action);
        expect(result.loading).toBe(true);
    });

    it('should handle fetchFeaturedVideos.fulfilled', () => {
        const mockVideos: Video[] = [
            {
                id: '1',
                title: 'Game 1',
                description: '',
                thumbnail: '',
                channelTitle: '',
                channelId: '',
                publishedAt: '',
            },
        ];
        const action = { type: fetchFeaturedVideos.fulfilled.type, payload: mockVideos };
        const result = reducer(initialState, action);
        expect(result.featured).toEqual(mockVideos);
        expect(result.loading).toBe(false);
    });

    it('should handle fetchVideosBySearch.fulfilled', () => {
        const mockVideos: Video[] = [
            {
                id: '2',
                title: 'Search result',
                description: '',
                thumbnail: '',
                channelTitle: '',
                channelId: '',
                publishedAt: '',
            },
        ];
        const action = { type: fetchVideosBySearch.fulfilled.type, payload: mockVideos };
        const result = reducer(initialState, action);
        expect(result.featured).toEqual(mockVideos);
    });

    it('should handle fetchTeamVideos.fulfilled', () => {
        const mockVideos: Video[] = [
            {
                id: '3',
                title: 'Team Video',
                description: '',
                thumbnail: '',
                channelTitle: '',
                channelId: '',
                publishedAt: '',
            },
        ];
        const action = {
            type: fetchTeamVideos.fulfilled.type,
            payload: mockVideos,
            meta: { arg: { teamName: '49ers' } },
        };
        const result = reducer(initialState, action);
        expect(result.teamVideos['49ers']).toEqual(mockVideos);
    });

    it('should handle rejected actions and set error', () => {
        const action = {
            type: 'videos/fetch/rejected',
            error: { message: 'Request failed' },
        };
        const result = reducer(initialState, action);
        expect(result.error).toBe('Request failed');
        expect(result.loading).toBe(false);
    });
});
