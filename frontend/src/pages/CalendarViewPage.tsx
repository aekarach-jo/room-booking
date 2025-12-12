import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: string;
  user: {
    fullName: string;
    role: string;
  };
  room: {
    id: string;
    name: string;
  };
}

const CalendarViewPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [currentWeek]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data.filter((r: any) => r.isActive));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const startDate = getWeekStart(currentWeek);
      const endDate = getWeekEnd(currentWeek);

      const response = await api.get('/bookings/calendar/view', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date: Date) => {
    const start = getWeekStart(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  };

  const getWeekDays = () => {
    const start = getWeekStart(currentWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const previousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const thisWeek = () => {
    setCurrentWeek(new Date());
  };

  const getBookingsForRoomAndDay = (roomId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return booking.room.id === roomId && bookingDate === dateStr;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 border-gray-400 text-gray-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'อนุมัติแล้ว';
      case 'PENDING':
        return 'รออนุมัติ';
      case 'REJECTED':
        return 'ปฏิเสธ';
      case 'CANCELLED':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const weekDays = getWeekDays();
  const weekStart = getWeekStart(currentWeek);
  const weekEnd = getWeekEnd(currentWeek);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">ตารางการจองรายสัปดาห์</h1>
        <p className="text-gray-600">ดูภาพรวมการจองห้องทั้งหมดในแต่ละสัปดาห์</p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={previousWeek}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            ← สัปดาห์ก่อน
          </button>
          <button
            onClick={thisWeek}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
          >
            สัปดาห์นี้
          </button>
          <button
            onClick={nextWeek}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            สัปดาห์ถัดไป →
          </button>
        </div>
        <div className="text-lg font-semibold">
          {weekStart.toLocaleDateString('th-TH', { day: 'numeric', month: 'long' })} -{' '}
          {weekEnd.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                ห้อง
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.toISOString()}
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div>{day.toLocaleDateString('th-TH', { weekday: 'short' })}</div>
                  <div className="text-sm font-normal">
                    {day.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id}>
                <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                  {room.name}
                  <div className="text-xs text-gray-500">ความจุ: {room.capacity}</div>
                </td>
                {weekDays.map((day) => {
                  const dayBookings = getBookingsForRoomAndDay(room.id, day);
                  return (
                    <td key={day.toISOString()} className="px-2 py-2 align-top">
                      {dayBookings.length === 0 ? (
                        <div className="text-center text-sm text-gray-400 py-4">ว่าง</div>
                      ) : (
                        <div className="space-y-1">
                          {dayBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className={`p-2 border-l-4 rounded text-xs ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              <div className="font-semibold">
                                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                              </div>
                              <div className="truncate">{booking.user.fullName}</div>
                              <div className="truncate text-gray-600">{booking.purpose}</div>
                              <div className="mt-1">
                                <span className="text-xs font-semibold">
                                  {getStatusLabel(booking.status)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <div className="text-center py-12 text-gray-500">ไม่พบข้อมูลห้อง</div>
        )}
      </div>

      <div className="mt-6 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-l-4 border-green-400 rounded"></div>
          <span>อนุมัติแล้ว</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-400 rounded"></div>
          <span>รออนุมัติ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-l-4 border-red-400 rounded"></div>
          <span>ปฏิเสธ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border-l-4 border-gray-400 rounded"></div>
          <span>ยกเลิก</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewPage;
