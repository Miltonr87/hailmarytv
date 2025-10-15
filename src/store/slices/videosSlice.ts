import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';
import axios from 'axios';

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
  },
});

export const { setLoading, setFeaturedVideos, setTeamVideos, setError } =
  videosSlice.actions;
export default videosSlice.reducer;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

async function fetchGlobalNFLVideos(): Promise<Video[]> {
  const queries = ['NFL ESPN Brasil', 'NFL GETV'];
  const allResults: Video[] = [];

  for (const q of queries) {
    const resp = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&order=date&q=${encodeURIComponent(
        q
      )}&key=${YOUTUBE_API_KEY}`
    );

    const videos: Video[] =
      resp.data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      })) || [];

    allResults.push(...videos);
  }
  const filtered = allResults.filter((v) =>
    ['ESPN Brasil', 'GETV'].some((name) =>
      v.channelTitle.toLowerCase().includes(name.toLowerCase())
    )
  );
  return Array.from(new Map(filtered.map((v) => [v.id, v])).values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export const fetchFeaturedVideos = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const videos = await fetchGlobalNFLVideos();
    dispatch(setFeaturedVideos(videos.slice(0, 8)));
  } catch (error: any) {
    console.error('❌ Error fetching featured videos:', error);
    dispatch(setError('Failed to fetch featured videos.'));
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

      dispatch(setTeamVideos({ team: teamName, videos: filtered.slice(0, 8) }));
    } catch (error: any) {
      console.error('❌ Error fetching team videos:', error);
      dispatch(setError('Failed to fetch team videos.'));
    }
  };
