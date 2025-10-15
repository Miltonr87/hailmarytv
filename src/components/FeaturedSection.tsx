import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { fetchFeaturedVideos } from '@/store/slices/videosSlice';
import VideoCard from './VideoCard';

const FeaturedSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featured, loading } = useSelector((state: RootState) => state.videos);

  useEffect(() => {
    dispatch(fetchFeaturedVideos());
  }, [dispatch]);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (loading && featured.length === 0) {
    return (
      <section className="py-8">
        <div className="container px-4">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
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
    <section className="py-8 bg-background">
      <div className="container px-4">
        <h2 className="text-2xl font-bold mb-6">Featured</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Featured Video - Takes 6 columns */}
          <div className="lg:col-span-6">
            {featured[0] && (
              <div
                onClick={() => handleVideoClick(featured[0].id)}
                className="group cursor-pointer animate-fade-in h-full"
              >
                <div className="relative overflow-hidden rounded-xl bg-muted h-full min-h-[400px]">
                  <img
                    src={featured[0].thumbnail}
                    alt={featured[0].title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="mt-3 space-y-1">
                  <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {featured[0].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{featured[0].channelTitle}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Three Smaller Videos - Takes 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            {featured.slice(1, 4).map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className="group cursor-pointer animate-fade-in"
              >
                <div className="relative overflow-hidden rounded-lg bg-muted aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2">
                  <h4 className="font-semibold line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">{video.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Ad Space - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-muted rounded-lg flex items-center justify-center aspect-square border-2 border-dashed border-border">
              <div className="text-center p-6">
                <p className="text-muted-foreground font-semibold">Square Pop-Up</p>
                <p className="text-xs text-muted-foreground mt-1">250x250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
