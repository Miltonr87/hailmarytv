import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import Navbar from '@/components/App/Navbar';
import SecondaryNav from '@/components/App/SecondaryNav';
import VideoCard from '@/components/Video/VideoCard';

import { NFL_TEAMS } from '@/data/nfl_teams';
import { fetchTeamVideos } from '@/features/videos';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const TeamPage = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const team = NFL_TEAMS.find(
    (t) => t.name.toLowerCase().replace(/\s+/g, '-') === teamName
  );

  const videos = useAppSelector((state) =>
    team ? state.videos.teamVideos[team.name] || [] : []
  );
  const loading = useAppSelector((state) => state.videos.loading);

  useEffect(() => {
    if (team && videos.length === 0) {
      dispatch(
        fetchTeamVideos({ teamName: team.name, searchQuery: team.searchQuery })
      );
    }
  }, [dispatch, team, videos.length]);

  const handleVideoClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <SecondaryNav />
        <div className="container px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Team Not Found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SecondaryNav />
      <div className="container px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4 mb-8">
          <div
            className="h-12 w-2 rounded-full"
            style={{ backgroundColor: team.color }}
          />
          <div className="flex items-center gap-3">
            {team.logoUrl && (
              <img
                src={team.logoUrl}
                alt={`${team.name} logo`}
                className="w-10 h-10 object-contain"
              />
            )}
            <h1 className="text-4xl font-bold">{team.name}</h1>
          </div>
        </div>
        {loading && videos.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-video bg-muted animate-pulse rounded-xl" />
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No videos found for this team.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
