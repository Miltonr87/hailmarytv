import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFeaturedVideos } from '@/store/slices/videosSlice';
import { VideoCard } from '@/components/VideoCard';

export const NFLVideos = () => {
  const dispatch = useAppDispatch();
  const { featured, loading, error } = useAppSelector((state) => state.videos);
  const videos = featured;

  useEffect(() => {
    if (!videos.length) dispatch(fetchFeaturedVideos());
  }, [dispatch]);

  if (loading) return <p className="p-6 text-center">Loading videos…</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🏈 Videos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
