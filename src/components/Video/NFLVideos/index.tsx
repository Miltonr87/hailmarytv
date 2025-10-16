import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchFeaturedVideos } from '@/features/videos';
import VideoCard from '@/components/Video/VideoCard';

const NFLVideos = () => {
  const dispatch = useAppDispatch();
  const { featured, loading, error } = useAppSelector((state) => state.videos);

  useEffect(() => {
    if (!featured.length) {
      dispatch(fetchFeaturedVideos());
    }
  }, [dispatch, featured.length]);

  if (loading) {
    return <p className="p-6 text-center">Loading videos…</p>;
  }

  if (error) {
    return <p className="p-6 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🏈 Videos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default NFLVideos;
