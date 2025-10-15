import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { NFL_TEAMS } from '@/config/youtube';

const SecondaryNav = () => {
  const navigate = useNavigate();

  const handleTeamClick = (teamName: string) => {
    const teamSlug = teamName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/team/${teamSlug}`);
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="container px-4">
        <div className="flex items-center gap-1 h-12">
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary hover:bg-accent/50"
          >
            Home
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:bg-accent/50"
              >
                Teams <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto">
              {NFL_TEAMS.map((team) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => handleTeamClick(team.name)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    {team.name}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;
