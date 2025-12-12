import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  DoorOpen,
  TrendingUp,
  Users,
  ArrowRight,
  BarChart3,
  Activity
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            ภาพรวมระบบจองห้องเรียน
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การจองทั้งหมด</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">รายการจองทั้งหมดในระบบ</p>
            <Progress value={100} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รออนุมัติ</CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats?.pendingBookings || 0}</div>
            {(stats?.pendingBookings || 0) > 0 ? (
              <Link 
                to="/admin/approvals" 
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1 transition-colors"
              >
                ดูรายการ <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">ไม่มีรายการรออนุมัติ</p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อนุมัติวันนี้</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.approvedToday || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">การจองที่อนุมัติแล้ววันนี้</p>
            <Progress value={(stats?.approvedToday || 0) / Math.max(stats?.totalBookings || 1, 1) * 100} className="mt-3 h-1" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ห้องว่าง</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <DoorOpen className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats?.availableRooms || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">ห้องที่พร้อมใช้งาน</p>
            <Badge variant="secondary" className="mt-2">พร้อมใช้งาน</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Trend */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">แนวโน้มการจอง</CardTitle>
              </div>
              <Badge variant="secondary">
                <BarChart3 className="h-3 w-3 mr-1" />
                7 วัน
              </Badge>
            </div>
            <CardDescription>แนวโน้มการจองในรอบ 7 วันล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.bookingTrend && stats.bookingTrend.length > 0 ? (
              <div className="space-y-3">
                {stats.bookingTrend.map((item, index) => (
                  <div key={index} className="group flex items-center gap-4 hover:bg-accent/50 p-2 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-muted-foreground w-24">
                      {new Date(item.date).toLocaleDateString('th-TH', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex-1">
                      <div className="h-10 bg-secondary rounded-lg overflow-hidden shadow-sm">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-3 transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
                          style={{
                            width: `${Math.max(
                              (item.count / Math.max(...stats.bookingTrend.map((t) => t.count))) * 100,
                              8
                            )}%`,
                          }}
                        >
                          <span className="text-sm font-bold text-white">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">ยังไม่มีข้อมูลการจอง</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Rooms */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <DoorOpen className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">ห้องยอดนิยม</CardTitle>
              </div>
              <Badge variant="secondary">Top 5</Badge>
            </div>
            <CardDescription>ห้องที่ถูกจองมากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.topRooms && stats.topRooms.length > 0 ? (
              <div className="space-y-3">
                {stats.topRooms.slice(0, 5).map((room, index) => (
                  <div key={index} className="group flex items-center gap-4 hover:bg-accent/50 p-2 rounded-lg transition-colors">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium min-w-[100px] truncate">{room.roomName}</span>
                    <div className="flex-1">
                      <div className="h-10 bg-secondary rounded-lg overflow-hidden shadow-sm">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-end px-3 transition-all duration-500 hover:from-green-600 hover:to-green-700"
                          style={{
                            width: `${Math.max(
                              (room.bookingCount / Math.max(...stats.topRooms.map((r) => r.bookingCount))) * 100,
                              8
                            )}%`,
                          }}
                        >
                          <span className="text-sm font-bold text-white">{room.bookingCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <DoorOpen className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">ยังไม่มีข้อมูลห้อง</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">ช่วงเวลายอดนิยม</CardTitle>
              </div>
            </div>
            <CardDescription>ช่วงเวลาที่จองมากที่สุด</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.peakHours && stats.peakHours.length > 0 ? (
              <div className="space-y-2">
                {stats.peakHours.slice(0, 5).map((hour, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent/50 transition-colors border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-orange-500" />
                      </div>
                      <span className="text-sm font-medium">
                        {hour.hour.toString().padStart(2, '0')}:00 น.
                      </span>
                    </div>
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      {hour.count} ครั้ง
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">ยังไม่มีข้อมูลช่วงเวลา</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking by Role */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">การจองตามบทบาท</CardTitle>
              </div>
            </div>
            <CardDescription>สถิติการจองแยกตาม Role</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.bookingByRole && stats.bookingByRole.length > 0 ? (
              <div className="space-y-2">
                {stats.bookingByRole.map((role, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-accent/50 transition-colors border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-500" />
                      </div>
                      <span className="text-sm font-medium">{role.role}</span>
                    </div>
                    <Badge className="bg-purple-500 hover:bg-purple-600">
                      {role.count} ครั้ง
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mb-2 opacity-20" />
                <p className="text-sm">ยังไม่มีข้อมูลผู้ใช้</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
