import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchFeaturedVideos } from '@/store/slices/videosSlice';

const LazyYouTubePlayer = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="aspect-video rounded-xl overflow-hidden">
      {visible && (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

const FeaturedSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featured, loading } = useSelector((state: RootState) => state.videos);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFeaturedVideos());
  }, [dispatch]);

  const handleVideoClick = (videoId: string) =>
    setActiveVideoId((prev) => (prev === videoId ? null : videoId));

  if (loading && featured.length === 0) {
    return (
      <section className="py-8">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-muted animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-background">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {featured[0] && (
              <motion.div
                onClick={() => handleVideoClick(featured[0].id)}
                className="group cursor-pointer rounded-xl overflow-hidden transition-transform"
                whileHover={{ scale: 1.02 }}
              >
                {activeVideoId === featured[0].id ? (
                  <LazyYouTubePlayer
                    videoId={featured[0].id}
                    title={featured[0].title}
                  />
                ) : (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img
                      src={featured[0].thumbnail}
                      alt={featured[0].title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none rounded-xl group-hover:shadow-[0_0_40px_8px_rgba(0,0,0,0.35)] transition-shadow duration-500" />
                  </div>
                )}
                <div className="mt-3">
                  <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {featured[0].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {featured[0].channelTitle}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
          <div className="lg:col-span-5 space-y-4">
            {featured.slice(1, 4).map((video, i) => (
              <motion.div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className="group cursor-pointer flex gap-3 items-center rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-44 flex-shrink-0 overflow-hidden rounded-lg aspect-video">
                  {activeVideoId === video.id ? (
                    <LazyYouTubePlayer videoId={video.id} title={video.title} />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {video.channelTitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
