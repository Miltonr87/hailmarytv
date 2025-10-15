import { Search, Upload, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { useGoogleLogin } from '@react-oauth/google';
import { loginSuccess } from '@/store/slices/authSlice';
import axios from 'axios';
import footballLogo from '@/assets/football-logo.png';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${response.access_token}` } }
        );
        
        dispatch(loginSuccess({
          name: userInfo.data.name,
          email: userInfo.data.email,
          picture: userInfo.data.picture,
          accessToken: response.access_token,
        }));
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    scope: 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={footballLogo} alt="Football" className="w-10 h-10 object-contain" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              HailMaryTV
            </h1>
          </div>
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

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Upload className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ring-2 ring-primary"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-xs hover:text-accent"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => handleGoogleLogin()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
