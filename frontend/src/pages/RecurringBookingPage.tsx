import { useState, useEffect } from 'react';
import axios from 'axios';

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface RecurringBooking {
  id: string;
  room: Room;
  startDate: string;
  endDate?: string;
  pattern: 'DAILY' | 'WEEKLY' | 'CUSTOM';
  daysOfWeek?: number[];
  startTime: string;
  endTime: string;
  purpose: string;
  createdAt: string;
}

const API_URL = 'http://localhost:3000';

const RecurringBookingPage = () => {
  const [recurringBookings, setRecurringBookings] = useState<RecurringBooking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    roomId: '',
    startDate: '',
    endDate: '',
    pattern: 'WEEKLY' as 'DAILY' | 'WEEKLY' | 'CUSTOM',
    daysOfWeek: [] as number[],
    startTime: '',
    endTime: '',
    purpose: '',
  });

  useEffect(() => {
    fetchRecurringBookings();
    fetchRooms();
  }, []);

  const fetchRecurringBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/recurring-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecurringBookings(response.data);
    } catch (error) {
      console.error('Error fetching recurring bookings:', error);
      alert('ไม่สามารถโหลดข้อมูลการจองซ้ำได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.pattern === 'WEEKLY' && formData.daysOfWeek.length === 0) {
      alert('กรุณาเลือกวันในสัปดาห์อย่างน้อย 1 วัน');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        daysOfWeek:
          formData.pattern === 'WEEKLY' ? formData.daysOfWeek : undefined,
      };

      await axios.post(`${API_URL}/recurring-bookings`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('สร้างการจองซ้ำสำเร็จ');
      setShowForm(false);
      setFormData({
        roomId: '',
        startDate: '',
        endDate: '',
        pattern: 'WEEKLY',
        daysOfWeek: [],
        startTime: '',
        endTime: '',
        purpose: '',
      });
      fetchRecurringBookings();
    } catch (error: any) {
      console.error('Error creating recurring booking:', error);
      alert(
        error.response?.data?.message || 'ไม่สามารถสร้างการจองซ้ำได้'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'ต้องการลบการจองซ้ำนี้หรือไม่? การจองทั้งหมดที่เกี่ยวข้องจะถูกลบด้วย'
      )
    )
      return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/recurring-bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('ลบการจองซ้ำสำเร็จ');
      fetchRecurringBookings();
    } catch (error) {
      console.error('Error deleting recurring booking:', error);
      alert('ไม่สามารถลบการจองซ้ำได้');
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day].sort(),
    }));
  };

  const getDayName = (day: number) => {
    const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
    return days[day - 1] || day;
  };

  const getPatternLabel = (pattern: string) => {
    switch (pattern) {
      case 'DAILY':
        return 'ทุกวัน';
      case 'WEEKLY':
        return 'รายสัปดาห์';
      case 'CUSTOM':
        return 'กำหนดเอง';
      default:
        return pattern;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">การจองซ้ำ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'ปิด' : '+ สร้างการจองซ้ำ'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">สร้างการจองซ้ำใหม่</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ห้อง</label>
              <select
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- เลือกห้อง --</option>
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
                  วันเริ่มต้น
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  วันสิ้นสุด (ถ้ามี)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รูปแบบ</label>
              <select
                value={formData.pattern}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pattern: e.target.value as 'DAILY' | 'WEEKLY' | 'CUSTOM',
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="DAILY">ทุกวัน</option>
                <option value="WEEKLY">รายสัปดาห์</option>
                <option value="CUSTOM">กำหนดเอง</option>
              </select>
            </div>

            {formData.pattern === 'WEEKLY' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  เลือกวันในสัปดาห์
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDayOfWeek(day)}
                      className={`px-4 py-2 rounded border ${
                        formData.daysOfWeek.includes(day)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {getDayName(day)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  เวลาเริ่มต้น
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  เวลาสิ้นสุด
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                วัตถุประสงค์
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                สร้างการจองซ้ำ
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recurring Bookings List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ห้อง
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                รูปแบบ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                วัน
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                เวลา
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ระยะเวลา
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                วัตถุประสงค์
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recurringBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  ไม่มีการจองซ้ำ
                </td>
              </tr>
            ) : (
              recurringBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{booking.room.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {getPatternLabel(booking.pattern)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.pattern === 'WEEKLY' && booking.daysOfWeek
                      ? booking.daysOfWeek.map(getDayName).join(', ')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(booking.startDate).toLocaleDateString('th-TH')}
                    {booking.endDate
                      ? ` - ${new Date(booking.endDate).toLocaleDateString(
                          'th-TH'
                        )}`
                      : ' - ไม่จำกัด'}
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.purpose}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecurringBookingPage;
