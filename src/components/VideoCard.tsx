import { useState, useRef, useEffect } from 'react';
import { Video } from '@/store/slices/videosSlice';
import { formatDistanceToNow } from 'date-fns';

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
    <div
      className="group cursor-pointer animate-fade-in"
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying ? (
        <>
          <div className="relative overflow-hidden rounded-xl bg-muted">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="mt-3 space-y-1">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            <p className="text-sm text-muted-foreground">
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
    </div>
  );
};

export default VideoCard;
