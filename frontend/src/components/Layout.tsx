import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationsComponent from './NotificationsComponent';
import { useState } from 'react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'STAFF' || user?.role === 'DEPARTMENT_HEAD';
  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-blue-600">
                Classroom Booking System
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                {user?.fullName} ({user?.role})
              </span>
              <NotificationsComponent />
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white shadow-md min-h-screen">
            <nav className="p-4 space-y-2">
              {/* General Links */}
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              >
                หน้าแรก
              </Link>
              <Link
                to="/book"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              >
                จองห้อง
              </Link>
              <Link
                to="/my-bookings"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              >
                การจองของฉัน
              </Link>
              <Link
                to="/calendar"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              >
                ตารางการจอง
              </Link>
              <Link
                to="/announcements"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
              >
                ประกาศ
              </Link>

              {/* Teacher Links */}
              {isTeacher && (
                <>
                  <div className="pt-4 pb-2 border-t">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase">
                      อาจารย์
                    </p>
                  </div>
                  <Link
                    to="/recurring-bookings"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    การจองซ้ำ
                  </Link>
                </>
              )}

              {/* Admin Links */}
              {isAdmin && (
                <>
                  <div className="pt-4 pb-2 border-t">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase">
                      จัดการ
                    </p>
                  </div>
                  <Link
                    to="/admin/approvals"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    อนุมัติการจอง
                  </Link>
                  <Link
                    to="/admin/rooms"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    จัดการห้อง
                  </Link>
                  <Link
                    to="/admin/users"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    จัดการผู้ใช้
                  </Link>
                  <Link
                    to="/admin/semesters"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    จัดการภาคเรียน
                  </Link>
                  <Link
                    to="/admin/special-dates"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    จัดการวันพิเศษ
                  </Link>
                  <Link
                    to="/admin/history"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded"
                  >
                    ประวัติ
                  </Link>
                </>
              )}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
