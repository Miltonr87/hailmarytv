import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { NFL_TEAMS } from '@/config/youtube';
import { useState } from 'react';

const SecondaryNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const handleTeamClick = (teamName: string) => {
    const teamSlug = teamName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/team/${teamSlug}`);
    setOpen(false);
  };

  const navItems = [{ name: 'Home', route: '/' }];

  return (
    <nav className="border-b border-border bg-card/70 backdrop-blur-md">
      <div className="container px-4">
        <div className="flex items-center gap-3 h-12 relative">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              className="relative"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(item.route)}
                className="text-foreground hover:text-primary hover:bg-transparent"
              >
                {item.name}
              </Button>
              <AnimatePresence>
                {hovered === item.name && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary hover:bg-transparent flex items-center"
              >
                Teams <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-96 overflow-y-auto bg-card border border-border shadow-lg">
              <AnimatePresence>
                {open &&
                  NFL_TEAMS.map((team, i) => (
                    <motion.div
                      key={team.name}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <DropdownMenuItem
                        onClick={() => handleTeamClick(team.name)}
                        className="cursor-pointer hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={team.logoUrl}
                            alt={team.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="text-sm font-medium">
                            {team.name}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default SecondaryNav;
