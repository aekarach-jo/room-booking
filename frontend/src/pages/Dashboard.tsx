import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  DoorOpen,
  TrendingUp,
  Users,
  ArrowRight
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  approvedToday: number;
  availableRooms: number;
  bookingTrend: Array<{ date: string; count: number }>;
  topRooms: Array<{ roomName: string; bookingCount: number }>;
  peakHours: Array<{ hour: number; count: number }>;
  bookingByRole: Array<{ role: string; count: number }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/analytics/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">ภาพรวมระบบจองห้องเรียน</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การจองทั้งหมด</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">รายการจองทั้งหมดในระบบ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รออนุมัติ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</div>
            {(stats?.pendingBookings || 0) > 0 && (
              <Link to="/admin/approvals" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                ดูรายการ <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อนุมัติวันนี้</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.approvedToday || 0}</div>
            <p className="text-xs text-muted-foreground">การจองที่อนุมัติแล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ห้องว่าง</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats?.availableRooms || 0}</div>
            <p className="text-xs text-muted-foreground">ห้องที่พร้อมใช้งาน</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              แนวโน้มการจอง
            </CardTitle>
            <CardDescription>7 วันล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.bookingTrend && stats.bookingTrend.length > 0 ? (
              <div className="space-y-3">
                {stats.bookingTrend.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-20">
                      {new Date(item.date).toLocaleDateString('th-TH', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <div className="h-8 bg-secondary rounded-md overflow-hidden">
                        <div
                          className="h-full bg-primary flex items-center justify-end px-2 transition-all"
                          style={{
                            width: `${Math.max(
                              (item.count / Math.max(...stats.bookingTrend.map((t) => t.count))) * 100,
                              5
                            )}%`,
                          }}
                        >
                          <span className="text-xs font-medium text-primary-foreground">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>

        {/* Top Rooms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              ห้องยอดนิยม
            </CardTitle>
            <CardDescription>ห้องที่ถูกจองมากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.topRooms && stats.topRooms.length > 0 ? (
              <div className="space-y-3">
                {stats.topRooms.slice(0, 5).map((room, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-24 truncate">{room.roomName}</span>
                    <div className="flex-1">
                      <div className="h-8 bg-secondary rounded-md overflow-hidden">
                        <div
                          className="h-full bg-green-600 flex items-center justify-end px-2 transition-all"
                          style={{
                            width: `${Math.max(
                              (room.bookingCount / Math.max(...stats.topRooms.map((r) => r.bookingCount))) * 100,
                              5
                            )}%`,
                          }}
                        >
                          <span className="text-xs font-medium text-white">{room.bookingCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              ช่วงเวลายอดนิยม
            </CardTitle>
            <CardDescription>ช่วงเวลาที่จองมากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.peakHours && stats.peakHours.length > 0 ? (
              <div className="space-y-2">
                {stats.peakHours.slice(0, 5).map((hour, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium">
                      {hour.hour.toString().padStart(2, '0')}:00 น.
                    </span>
                    <span className="text-sm text-primary font-semibold">{hour.count} ครั้ง</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>

        {/* Booking by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              การจองตามประเภทผู้ใช้
            </CardTitle>
            <CardDescription>สถิติการจองแยกตาม Role</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.bookingByRole && stats.bookingByRole.length > 0 ? (
              <div className="space-y-2">
                {stats.bookingByRole.map((role, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium">{role.role}</span>
                    <span className="text-sm text-purple-600 font-semibold">{role.count} ครั้ง</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีข้อมูล</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
