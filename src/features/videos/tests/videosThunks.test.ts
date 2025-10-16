import {
    fetchFeaturedVideos,
    fetchVideosBySearch,
    fetchTeamVideos,
} from '../videosThunks';

jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: { items: [] } }),
}));

jest.mock('../videosThunks', () => ({
    fetchFeaturedVideos: { typePrefix: 'videos/fetchFeaturedVideos' },
    fetchVideosBySearch: { typePrefix: 'videos/fetchVideosBySearch' },
    fetchTeamVideos: { typePrefix: 'videos/fetchTeamVideos' },
}));

describe('videosThunks (mocked)', () => {
    it('should export fetchFeaturedVideos thunk', () => {
        expect(fetchFeaturedVideos).toBeDefined();
        expect(fetchFeaturedVideos.typePrefix).toBe('videos/fetchFeaturedVideos');
    });

    it('should export fetchVideosBySearch thunk', () => {
        expect(fetchVideosBySearch).toBeDefined();
        expect(fetchVideosBySearch.typePrefix).toBe('videos/fetchVideosBySearch');
    });

    it('should export fetchTeamVideos thunk', () => {
        expect(fetchTeamVideos).toBeDefined();
        expect(fetchTeamVideos.typePrefix).toBe('videos/fetchTeamVideos');
    });
});
