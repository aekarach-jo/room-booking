import React, { useState, useEffect } from 'react';
import { roomService } from '../services/room.service';
import { bookingService } from '../services/booking.service';
import api from '../services/api';
import { Room } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock, Users, FileText } from 'lucide-react';

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

const BookingPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Form states
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [currentMonth]);

  const fetchRooms = async () => {
    try {
      const allRooms = await roomService.getAllRooms();
      setRooms(allRooms.filter(r => r.isActive));
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const response = await api.get('/bookings/calendar/view', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date | null) => {
    if (!date) return [];
    // แปลง date เป็น local date string (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return bookings.filter((booking) => {
      // แปลง booking.date ให้เป็น local date string (YYYY-MM-DD)
      const bookingDate = booking.date.split('T')[0];
      return bookingDate === dateStr;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowDialog(true);
    setError('');
    setSuccess('');
    
    // Pre-fill date and default times (แปลงเป็น local date string)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // ถ้าเป็นวันนี้ ให้ใช้เวลาปัจจุบัน + 1 ชั่วโมง
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(date);
    selectedDateOnly.setHours(0, 0, 0, 0);
    
    if (selectedDateOnly.getTime() === today.getTime()) {
      // วันนี้ - ใช้เวลาปัจจุบัน + 1 ชั่วโมง
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
      const hours = String(nextHour.getHours()).padStart(2, '0');
      const minutes = String(Math.ceil(nextHour.getMinutes() / 15) * 15).padStart(2, '0'); // ปัดเป็น 15 นาที
      setStartTime(`${dateStr}T${hours}:${minutes}`);
      
      const endHour = new Date(nextHour.getTime() + 60 * 60 * 1000);
      const endHours = String(endHour.getHours()).padStart(2, '0');
      const endMinutes = String(Math.ceil(endHour.getMinutes() / 15) * 15).padStart(2, '0');
      setEndTime(`${dateStr}T${endHours}:${endMinutes}`);
    } else {
      // วันอื่น - ใช้เวลา default
      setStartTime(`${dateStr}T09:00`);
      setEndTime(`${dateStr}T10:00`);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedDate(null);
    setSelectedRoom('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
    setAttendees(1);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedRoom || !startTime || !endTime || !purpose) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // Validate that end time is after start time
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      setError('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น');
      return;
    }

    // Validate that booking is not in the past
    const now = new Date();
    if (start < now) {
      setError('ไม่สามารถจองย้อนหลังได้');
      return;
    }

    try {
      // แปลง datetime-local เป็น date string สำหรับ API
      const bookingDate = startTime.split('T')[0];
      
      await bookingService.createBooking({
        roomId: selectedRoom,
        date: bookingDate,
        startTime,
        endTime,
        purpose,
        attendees,
      });
      setSuccess('จองสำเร็จ! รอการอนุมัติ');
      fetchBookings(); // Refresh bookings
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'ไม่สามารถจองได้ ห้องอาจถูกจองในช่วงเวลานี้แล้ว';
      setError(errorMessage);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const thisMonth = () => {
    setCurrentMonth(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const days = getDaysInMonth();
  const weekDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">จองห้อง</h1>
            <p className="text-sm text-muted-foreground">เลือกวันที่ต้องการจองห้อง</p>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-card border rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={previousMonth}
            className="btn btn-secondary btn-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {currentMonth.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={thisMonth} className="text-sm text-primary hover:underline mt-1">
              วันนี้
            </button>
          </div>
          
          <button
            onClick={nextMonth}
            className="btn btn-secondary btn-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold p-2 text-muted-foreground">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((date, index) => {
            const dayBookings = getBookingsForDate(date);
            const isDateToday = isToday(date);
            const isDatePast = isPast(date);
            
            return (
              <div
                key={index}
                className={`min-h-[100px] border rounded-lg p-2 transition-all ${
                  date
                    ? isDatePast
                      ? 'bg-muted/20 cursor-not-allowed'
                      : 'bg-card hover:bg-accent hover:shadow-md cursor-pointer'
                    : 'bg-transparent border-transparent'
                } ${isDateToday ? 'ring-2 ring-primary' : ''}`}
                onClick={() => date && !isDatePast && handleDateClick(date)}
              >
                {date && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${isDateToday ? 'text-primary' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayBookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className={`text-xs px-2 py-1 rounded truncate ${
                            booking.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                          title={`${booking.room.name} - ${booking.user.fullName}`}
                        >
                          {new Date(booking.startTime).toLocaleTimeString('th-TH', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          {booking.room.name}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{dayBookings.length - 3} เพิ่มเติม
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b p-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">จองห้อง</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedDate?.toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                onClick={handleCloseDialog}
                className="btn btn-secondary btn-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start gap-2">
                  <span className="text-sm">{error}</span>
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-800 px-4 py-3 rounded-md flex items-start gap-2">
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">ห้อง *</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="input w-full"
                  required
                >
                  <option value="">เลือกห้อง</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (ความจุ: {room.capacity} คน)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    เวลาเริ่มต้น *
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    min={(() => {
                      if (!selectedDate) return '';
                      
                      const now = new Date();
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const selected = new Date(selectedDate);
                      selected.setHours(0, 0, 0, 0);
                      
                      // ถ้าเลือกวันนี้ ให้ใช้เวลาปัจจุบัน
                      if (selected.getTime() === today.getTime()) {
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        const day = String(now.getDate()).padStart(2, '0');
                        const hours = String(now.getHours()).padStart(2, '0');
                        const minutes = String(now.getMinutes()).padStart(2, '0');
                        return `${year}-${month}-${day}T${hours}:${minutes}`;
                      } else {
                        // ถ้าเลือกวันอื่น ให้เลือกได้ตั้งแต่ 00:00
                        const year = selectedDate.getFullYear();
                        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                        const day = String(selectedDate.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}T00:00`;
                      }
                    })()}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    เวลาสิ้นสุด *
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    min={startTime || (() => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, '0');
                      const day = String(now.getDate()).padStart(2, '0');
                      const hours = String(now.getHours()).padStart(2, '0');
                      const minutes = String(now.getMinutes()).padStart(2, '0');
                      return `${year}-${month}-${day}T${hours}:${minutes}`;
                    })()}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  จำนวนผู้เข้าร่วม *
                </label>
                <input
                  type="number"
                  min="1"
                  value={attendees}
                  onChange={(e) => setAttendees(parseInt(e.target.value, 10))}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  <FileText className="w-4 h-4 inline mr-1" />
                  วัตถุประสงค์ *
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="input w-full"
                  rows={4}
                  placeholder="ระบุวัตถุประสงค์การจอง..."
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  ยืนยันการจอง
                </button>
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="btn btn-secondary"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
