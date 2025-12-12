import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import NotificationsComponent from '../components/NotificationsComponent';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b bg-card flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Classroom Booking System</h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <NotificationsComponent />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="ออกจากระบบ"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
