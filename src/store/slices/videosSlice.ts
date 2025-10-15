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

const NFL_CHANNEL_ID = 'UCDVYQ4Zhbm3S2dlz7P1GBDg';

export const fetchFeaturedVideos = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));

  try {
    const channelResp = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${NFL_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const uploadsPlaylistId =
      channelResp.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) throw new Error('Uploads playlist not found');
    const playlistResp = await axios.get(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=8&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
    );
    const videos: Video[] =
      playlistResp.data.items?.map((item: any) => ({
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.high?.url,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        publishedAt: item.snippet.publishedAt,
      })) || [];
    dispatch(setFeaturedVideos(videos));
  } catch (error: any) {
    console.error('❌ Error fetching featured videos:', error);
    dispatch(setError('Failed to fetch featured videos'));
  }
};

export const fetchTeamVideos =
  (teamName: string, searchQuery: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const searchResp = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
          searchQuery
        )}&channelId=${NFL_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
      );
      const videos: Video[] =
        searchResp.data.items?.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          publishedAt: item.snippet.publishedAt,
        })) || [];
      dispatch(setTeamVideos({ team: teamName, videos }));
    } catch (error: any) {
      console.error('❌ Error fetching team videos:', error);
      dispatch(setError('Failed to fetch team videos'));
    }
  };
