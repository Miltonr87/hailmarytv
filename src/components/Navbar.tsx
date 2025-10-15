import { Search, Upload, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { googleSignIn, googleSignOut } from '@/store/slices/googleAuthSlice';
import footballLogo from '@/assets/football-logo.png';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((state: RootState) => state.googleAuth);

  const handleLogin = () => {
    if (status !== 'loading') dispatch(googleSignIn());
  };

  const handleLogout = () => {
    dispatch(googleSignOut());
  };

  const isAuthenticated = !!user;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <img
            src={footballLogo}
            alt="Football"
            className="w-9 h-9 object-contain"
          />
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            HailMaryTV
          </h1>
        </div>
        <div className="flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Input
              placeholder="Search NFL highlights..."
              className="pr-12 bg-muted border-border"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent hover:text-accent-foreground"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-primary"
                />
                <span className="text-sm font-medium">{user.name}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs font-semibold hover:bg-secondary/80"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={status === 'loading'}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <User className="h-4 w-4" />
              {status === 'loading' ? 'Signing in...' : 'Login'}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
