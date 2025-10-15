import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import VideoCard from './VideoCard';

const MoreVideosSection = () => {
  const { featured, loading } = useSelector((state: RootState) => state.videos);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading && featured.length === 0) {
    return (
      <section className="py-8 bg-muted/20">
        <div className="container px-4">
          <h2 className="text-2xl font-bold mb-6">More Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-muted animate-pulse rounded-xl" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-muted/20">
      <div className="container px-4">
        <div className="border border-border rounded-lg p-6 bg-card">
          <h2 className="text-2xl font-bold mb-6">More Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(4, 12).map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MoreVideosSection;
