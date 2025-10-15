import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
}

export const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  const opts = {
    height: '360',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};
