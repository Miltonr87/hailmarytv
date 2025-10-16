import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import mockVideos from '@/components/Video/__mocks__';
import { Video } from './videosTypes';
import { YOUTUBE_API_KEY } from '@/constants/nfl_teams';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const fetchFeaturedVideos = createAsyncThunk<Video[]>(
    'videos/fetchFeaturedVideos',
    async () => {
        if (USE_MOCK) {
            console.log('🧩 Using mock videos for featured feed');
            return mockVideos;
        }

        const queries = ['NFL ESPN Brasil', 'NFL GETV'];
        const allVideos: Video[] = [];

        for (const q of queries) {
            const url = new URL('https://www.googleapis.com/youtube/v3/search');
            url.searchParams.set('part', 'snippet');
            url.searchParams.set('type', 'video');
            url.searchParams.set('order', 'date');
            url.searchParams.set('maxResults', '50');
            url.searchParams.set('q', q);
            url.searchParams.set('key', YOUTUBE_API_KEY);

            const resp = await axios.get(url.toString());
            const items = resp.data.items || [];

            const videos = items.map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails?.high?.url,
                channelTitle: item.snippet.channelTitle,
                channelId: item.snippet.channelId,
                publishedAt: item.snippet.publishedAt,
            }));

            allVideos.push(...videos);
        }

        return allVideos.slice(0, 40);
    }
);

export const fetchVideosBySearch = createAsyncThunk<Video[], string>(
    'videos/fetchVideosBySearch',
    async (query) => {
        if (USE_MOCK) {
            console.log('🧩 Using mock videos for search');
            const filtered = mockVideos.filter((v) =>
                v.title.toLowerCase().includes(query.toLowerCase())
            );
            return filtered.slice(0, 40);
        }

        const url = new URL('https://www.googleapis.com/youtube/v3/search');
        url.searchParams.set('part', 'snippet');
        url.searchParams.set('type', 'video');
        url.searchParams.set('order', 'relevance');
        url.searchParams.set('maxResults', '25');
        url.searchParams.set('q', `${query} NFL`);
        url.searchParams.set('key', YOUTUBE_API_KEY);

        const resp = await axios.get(url.toString());
        const items = resp.data.items || [];

        return items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails?.high?.url,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            publishedAt: item.snippet.publishedAt,
        }));
    }
);

export const fetchTeamVideos = createAsyncThunk<
    Video[],
    { teamName: string; searchQuery: string }
>('videos/fetchTeamVideos', async ({ teamName, searchQuery }) => {
    if (USE_MOCK) {
        console.log(`🧩 Using mock data for ${teamName}`);
        const filtered = mockVideos.filter((v) =>
            v.title.toLowerCase().includes(teamName.toLowerCase())
        );
        return filtered.slice(0, 25);
    }

    const q = `${searchQuery || teamName} NFL`;
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('order', 'date');
    url.searchParams.set('maxResults', '25');
    url.searchParams.set('q', q);
    url.searchParams.set('key', YOUTUBE_API_KEY);

    const resp = await axios.get(url.toString());
    const items = resp.data.items || [];

    return items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
    }));
});
