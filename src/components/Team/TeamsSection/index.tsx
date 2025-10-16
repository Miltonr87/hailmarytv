import { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTeamVideos } from '@/features/videos';
import { NFL_TEAMS } from '@/config/youtube';
import VideoCard from '@/components/Video/VideoCard';

interface TeamSectionProps {
  teamName: string;
  searchQuery: string;
  teamColor: string;
}

const TeamSection = ({
  teamName,
  searchQuery,
  teamColor,
}: TeamSectionProps) => {
  const dispatch = useAppDispatch();
  const videos =
    useAppSelector((state) => state.videos.teamVideos[teamName]) || [];

  useEffect(() => {
    if (videos.length === 0) {
      dispatch(fetchTeamVideos({ teamName, searchQuery }));
    }
  }, [dispatch, teamName, searchQuery, videos.length]);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="py-6 border-b border-border last:border-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-1 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
          <h3 className="text-2xl font-bold">{teamName}</h3>
        </div>
        <Button
          variant="ghost"
          className="text-primary hover:text-accent"
          onClick={() =>
            window.open(
              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                searchQuery
              )}`,
              '_blank'
            )
          }
        >
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {videos.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-video bg-muted animate-pulse rounded-xl" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.slice(0, 4).map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => handleVideoClick(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TeamsSection = () => {
  return (
    <section className="py-12 bg-muted/20">
      <div className="container px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-1 w-12 bg-gradient-to-r from-secondary to-accent rounded-full" />
          <h2 className="text-3xl font-bold">NFL Teams</h2>
        </div>

        <div className="space-y-0">
          {NFL_TEAMS.slice(0, 8).map((team) => (
            <TeamSection
              key={team.name}
              teamName={team.name}
              searchQuery={team.searchQuery}
              teamColor={team.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;
