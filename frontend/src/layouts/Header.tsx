import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LogOut, Bell, User } from 'lucide-react';
import NotificationsComponent from '../components/NotificationsComponent';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6 justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Classroom Booking System
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <NotificationsComponent />

            <Separator orientation="vertical" className="h-8" />

            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-semibold">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
