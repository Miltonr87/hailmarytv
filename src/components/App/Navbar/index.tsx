import { useState } from 'react';
import { Upload, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { googleSignIn, googleSignOut } from '@/features/googleAuth';
import { Modal } from '@/components/ui/modal';
import VideoUpload from '@/components/Video/VideoUpload';
import Searchbar from '@/components/App/Searchbar';
import { toast } from '@/hooks/useToast';

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, status } = useSelector((state: RootState) => state.googleAuth);
  const [openUpload, setOpenUpload] = useState(false);
  const isAuthenticated = !!user;

  const handleLogin = async () => {
    if (status === 'loading') return;
    try {
      await dispatch(googleSignIn()).unwrap();
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`,
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Please try again later.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(googleSignOut()).unwrap();
      toast({
        title: 'Logged out',
        description: 'You have been signed out successfully.',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: 'Something went wrong while signing out.',
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-sm">🏈</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            HailMaryTV
          </h1>
        </div>
        <div className="flex flex-1 max-w-2xl mx-8">
          <Searchbar />
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenUpload(true)}
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
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-9 h-9 rounded-full ring-2 ring-primary object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <span className="text-sm font-medium truncate max-w-[120px]">
                  {user?.name?.split(' ')[0] || 'User'}
                </span>
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
      <Modal
        open={openUpload}
        onOpenChange={setOpenUpload}
        title="Upload NFL Highlight"
        description="Select a video file and upload it directly to your YouTube channel."
      >
        {user?.access_token ? (
          <VideoUpload accessToken={user.access_token} />
        ) : (
          <p className="text-center text-muted-foreground">
            Please sign in with Google to upload.
          </p>
        )}
      </Modal>
    </nav>
  );
};

export default Navbar;
