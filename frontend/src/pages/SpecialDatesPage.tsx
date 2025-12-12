import { useState, useEffect } from 'react';
import axios from 'axios';

interface SpecialDate {
  id: string;
  name: string;
  date: string;
  type: 'HOLIDAY' | 'EXAM' | 'EVENT';
  description?: string;
  semesterId?: string;
}

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const API_URL = 'http://localhost:3000';

const SpecialDatesPage = () => {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    type: 'HOLIDAY' as 'HOLIDAY' | 'EXAM' | 'EVENT',
    description: '',
    semesterId: '',
  });

  useEffect(() => {
    fetchSpecialDates();
    fetchSemesters();
  }, [selectedMonth, selectedYear]);

  const fetchSpecialDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/special-dates?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSpecialDates(response.data);
    } catch (error) {
      console.error('Error fetching special dates:', error);
      alert('ไม่สามารถโหลดข้อมูลวันพิเศษได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/semesters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/special-dates`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('เพิ่มวันพิเศษสำเร็จ');
      setShowForm(false);
      setFormData({
        name: '',
        date: '',
        type: 'HOLIDAY',
        description: '',
        semesterId: '',
      });
      fetchSpecialDates();
    } catch (error) {
      console.error('Error creating special date:', error);
      alert('ไม่สามารถเพิ่มวันพิเศษได้');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบวันพิเศษนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/special-dates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('ลบวันพิเศษสำเร็จ');
      fetchSpecialDates();
    } catch (error) {
      console.error('Error deleting special date:', error);
      alert('ไม่สามารถลบวันพิเศษได้');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HOLIDAY':
        return 'วันหยุด';
      case 'EXAM':
        return 'วันสอบ';
      case 'EVENT':
        return 'วันพิเศษ';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'HOLIDAY':
        return 'bg-red-100 text-red-800';
      case 'EXAM':
        return 'bg-yellow-100 text-yellow-800';
      case 'EVENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold">จัดการวันพิเศษ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'ปิด' : '+ เพิ่มวันพิเศษ'}
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4 items-center">
          <label className="font-semibold">เลือกเดือน/ปี:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleDateString('th-TH', {
                  month: 'long',
                })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year + 543}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">เพิ่มวันพิเศษใหม่</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อวันพิเศษ</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">วันที่</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ประเภท</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'HOLIDAY' | 'EXAM' | 'EVENT',
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="HOLIDAY">วันหยุด</option>
                <option value="EXAM">วันสอบ</option>
                <option value="EVENT">วันพิเศษ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ภาคเรียน (ถ้ามี)</label>
              <select
                value={formData.semesterId}
                onChange={(e) =>
                  setFormData({ ...formData, semesterId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- ไม่ระบุ --</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รายละเอียด</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                บันทึก
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

      {/* Special Dates List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                วันที่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ชื่อวันพิเศษ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                รายละเอียด
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {specialDates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  ไม่มีวันพิเศษในเดือนนี้
                </td>
              </tr>
            ) : (
              specialDates.map((date) => (
                <tr key={date.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(date.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">{date.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(
                        date.type
                      )}`}
                    >
                      {getTypeLabel(date.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {date.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(date.id)}
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

export default SpecialDatesPage;
