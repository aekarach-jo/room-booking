import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Bell,
  CheckCircle,
  Users,
  DoorOpen,
  Calendar,
  Star,
  History,
  Repeat,
  Moon,
  Sun,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem = ({ to, icon, children }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
        )
      }
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span>{children}</span>
    </NavLink>
  );
};

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
}

const NavGroup = ({ title, children }: NavGroupProps) => (
  <div className="mt-6 space-y-1">
    <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

const Sidebar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isStaff = user?.role === 'STAFF';
  const isDeptHead = user?.role === 'DEPARTMENT_HEAD';
  const isTeacher = user?.role === 'TEACHER';
  const isAdmin = isStaff || isDeptHead;

  return (
    <aside className="w-64 border-r bg-card min-h-screen flex flex-col shadow-sm">
      {/* Logo/Brand */}
      <div className="p-6 border-b space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Room Booking</h2>
            <p className="text-xs text-muted-foreground">ระบบจองห้อง</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem to="/" icon={<LayoutDashboard className="w-4 h-4" />}>
          หน้าแรก
        </NavItem>

        <NavItem to="/book" icon={<BookOpen className="w-4 h-4" />}>
          จองห้อง
        </NavItem>

        <NavItem to="/my-bookings" icon={<CalendarDays className="w-4 h-4" />}>
          การจองของฉัน
        </NavItem>

        <NavItem to="/calendar" icon={<Calendar className="w-4 h-4" />}>
          ตารางการจอง
        </NavItem>

        <NavItem to="/announcements" icon={<Bell className="w-4 h-4" />}>
          ประกาศ
        </NavItem>

        {/* Teacher Section */}
        {isTeacher && (
          <NavGroup title="อาจารย์">
            <NavItem to="/recurring-bookings" icon={<Repeat className="w-4 h-4" />}>
              การจองซ้ำ
            </NavItem>
          </NavGroup>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <NavGroup title="จัดการระบบ">
            <NavItem to="/admin/approvals" icon={<CheckCircle className="w-4 h-4" />}>
              อนุมัติการจอง
            </NavItem>

            <NavItem to="/admin/rooms" icon={<DoorOpen className="w-4 h-4" />}>
              จัดการห้อง
            </NavItem>

            <NavItem to="/admin/users" icon={<Users className="w-4 h-4" />}>
              จัดการผู้ใช้
            </NavItem>

            <NavItem to="/admin/semesters" icon={<Calendar className="w-4 h-4" />}>
              จัดการภาคเรียน
            </NavItem>

            <NavItem to="/admin/special-dates" icon={<Star className="w-4 h-4" />}>
              จัดการวันพิเศษ
            </NavItem>

            <NavItem to="/admin/history" icon={<History className="w-4 h-4" />}>
              ประวัติ
            </NavItem>
          </NavGroup>
        )}
      </nav>

      {/* Theme Toggle & User Profile */}
      <div className="p-4 border-t space-y-3 bg-muted/5">
        {/* Theme Toggle Button */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-3"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4" />
              <span>โหมดสว่าง</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>โหมดมืด</span>
            </>
          )}
        </Button>

        <Separator />

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <Avatar className="h-10 w-10 border-2 border-primary/30">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.fullName}</p>
            <Badge variant="secondary" className="text-xs mt-1">
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
