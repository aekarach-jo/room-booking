import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import RoomManagementPage from './pages/RoomManagementPage';
import HistoryPage from './pages/HistoryPage';
import UserManagementPage from './pages/UserManagementPage';
import CalendarViewPage from './pages/CalendarViewPage';
import SemesterManagementPage from './pages/SemesterManagementPage';
import SpecialDatesPage from './pages/SpecialDatesPage';
import RecurringBookingPage from './pages/RecurringBookingPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/calendar" element={<CalendarViewPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/recurring-bookings" element={<RecurringBookingPage />} />

          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/approvals" element={<AdminApprovalPage />} />
            <Route path="/admin/rooms" element={<RoomManagementPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/semesters" element={<SemesterManagementPage />} />
            <Route path="/admin/special-dates" element={<SpecialDatesPage />} />
            <Route path="/admin/history" element={<HistoryPage />} />
          </Route>
        </Route>
      </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
