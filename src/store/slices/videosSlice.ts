import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import axios from 'axios';
import mockVideos from '../mocks';

// -----------------------------
// 🔹 Types
// -----------------------------
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
  searchHistory: string[];
  loading: boolean;
  error: string | null;
}

// -----------------------------
// 🔹 Initial state
// -----------------------------
const initialState: VideosState = {
  featured: [],
  teamVideos: {},
  searchHistory: [],
  loading: false,
  error: null,
};

// -----------------------------
// 🔹 LocalStorage helpers
// -----------------------------
function saveSearchHistory(term: string): string[] {
  const key = 'search_history';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = [term, ...existing.filter((t: string) => t !== term)].slice(0, 10);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}

function loadSearchHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  } catch {
    return [];
  }
}

// -----------------------------
// 🔹 Slice
// -----------------------------
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
    setTeamVideos: (
      state,
      action: PayloadAction<{ team: string; videos: Video[] }>
    ) => {
      state.teamVideos[action.payload.team] = action.payload.videos;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addSearchHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = saveSearchHistory(action.payload);
    },
    loadSearchHistoryState: (state) => {
      state.searchHistory = loadSearchHistory();
    },
  },
});

export const {
  setLoading,
  setFeaturedVideos,
  setTeamVideos,
  setError,
  addSearchHistory,
  loadSearchHistoryState,
} = videosSlice.actions;

export default videosSlice.reducer;

// -----------------------------
// 🔹 Config
// -----------------------------
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// -----------------------------
// 🔹 Helpers
// -----------------------------
async function fetchGlobalNFLVideos(): Promise<Video[]> {
  if (USE_MOCK) {
    console.log('🧩 Skipping YouTube API — using mock videos only.');
    return mockVideos;
  }

  const queries = ['NFL ESPN Brasil', 'NFL GETV'];
  const allResults: Video[] = [];

  for (const q of queries) {
    let nextPageToken = '';
    let pageCount = 0;
    while (pageCount < 3) {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('order', 'date');
      url.searchParams.set('maxResults', '50');
      url.searchParams.set('q', q);
      url.searchParams.set('key', YOUTUBE_API_KEY);
      if (nextPageToken) url.searchParams.set('pageToken', nextPageToken);
      const resp = await axios.get(url.toString());
      const items = resp.data.items || [];
      const videos: Video[] = items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      }));
      allResults.push(...videos);
      nextPageToken = resp.data.nextPageToken;
      if (!nextPageToken) break;
      pageCount++;
    }
  }

  const filtered = allResults.filter((v) =>
    ['ESPN Brasil', 'GETV'].some((name) =>
      v.channelTitle.toLowerCase().includes(name.toLowerCase())
    )
  );
  return Array.from(new Map(filtered.map((v) => [v.id, v])).values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// -----------------------------
// 🔹 Thunks
// -----------------------------
export const fetchFeaturedVideos = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const videos = await fetchGlobalNFLVideos();
    dispatch(setFeaturedVideos(videos.slice(0, 40)));
  } catch (error: any) {
    console.error('⚠️ Using mock videos due to API failure:', error?.message || error);
    dispatch(setFeaturedVideos(mockVideos));
    dispatch(
      setError(
        error?.response?.status
          ? `YouTube API error ${error.response.status} — fallback to mock data.`
          : 'Network error — using mock videos.'
      )
    );
  }
};

export const fetchVideosBySearch =
  (query: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    dispatch(addSearchHistory(query)); // ✅ salva histórico

    try {
      if (USE_MOCK) {
        console.log('🧩 Using mock data for search results.');
        const filtered = mockVideos.filter((v) =>
          v.title.toLowerCase().includes(query.toLowerCase())
        );
        dispatch(setFeaturedVideos(filtered.slice(0, 40)));
        return;
      }

      const searchQuery = `${query} NFL`; // ✅ apenas 1 vez

      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('type', 'video');
      url.searchParams.set('order', 'relevance');
      url.searchParams.set('maxResults', '25');
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('key', YOUTUBE_API_KEY);

      const resp = await axios.get(url.toString());
      const items = resp.data.items || [];

      const videos: Video[] = items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      }));

      const filtered = videos.filter(
        (v) =>
          v.title.toLowerCase().includes('nfl') ||
          v.description.toLowerCase().includes('nfl') ||
          v.channelTitle.toLowerCase().includes('nfl')
      );

      dispatch(setFeaturedVideos(filtered.slice(0, 40)));
    } catch (error: any) {
      console.error('⚠️ Search failed:', error?.message || error);
      dispatch(setFeaturedVideos(mockVideos));
      dispatch(
        setError(
          error?.response?.status
            ? `YouTube API error ${error.response.status} — fallback to mock data.`
            : 'Network error — using mock videos.'
        )
      );
    }
  };

export const fetchTeamVideos =
  (teamName: string, searchQuery: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const videos = await fetchGlobalNFLVideos();
      const filtered = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      dispatch(setTeamVideos({ team: teamName, videos: filtered.slice(0, 40) }));
    } catch (error: any) {
      console.error(
        '⚠️ Using mock videos for team due to API failure:',
        error?.message || error
      );
      dispatch(setTeamVideos({ team: teamName, videos: mockVideos }));
      dispatch(
        setError(
          error?.response?.status
            ? `YouTube API error ${error.response.status} — fallback to mock data.`
            : 'Network error — using mock videos.'
        )
      );
    }
  };
