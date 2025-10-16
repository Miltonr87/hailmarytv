import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Video } from '@/features/videos';

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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

const VideoCard = ({ video }: { video: Video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          <div className="relative overflow-hidden rounded-t-xl bg-muted">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              <Clock className="w-3 h-3" />
              <span>
                {Math.floor(Math.random() * 40) + 1}:
                {Math.floor(Math.random() * 59)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {video.channelTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(video.publishedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </>
      ) : (
        <LazyYouTubePlayer videoId={video.id} title={video.title} />
      )}
    </motion.div>
  );
};

export default VideoCard;
