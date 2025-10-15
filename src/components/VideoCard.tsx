import { Video } from '@/store/slices/videosSlice';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: Video;
  onClick?: () => void;
}

const VideoCard = ({ video, onClick }: VideoCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer animate-fade-in"
    >
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
        <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;
