import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

const SemesterManagementPage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await api.get('/semesters');
      setSemesters(response.data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/semesters', formData);
      setShowForm(false);
      setFormData({ name: '', startDate: '', endDate: '' });
      fetchSemesters();
    } catch (error) {
      console.error('Error creating semester:', error);
    }
  };

  const activateSemester = async (id: string) => {
    try {
      await api.patch(`/semesters/${id}/activate`);
      fetchSemesters();
    } catch (error) {
      console.error('Error activating semester:', error);
    }
  };

  const deleteSemester = async (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบภาคเรียนนี้?')) {
      try {
        await api.delete(`/semesters/${id}`);
        fetchSemesters();
      } catch (error) {
        console.error('Error deleting semester:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">จัดการภาคเรียน</h1>
          <p className="text-gray-600">จัดการข้อมูลภาคเรียนทั้งหมด</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + เพิ่มภาคเรียน
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">เพิ่มภาคเรียนใหม่</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อภาคเรียน</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น เทอม 1/2568"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันเริ่ม</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">วันสิ้นสุด</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                บันทึก
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {semesters.map((semester) => (
          <div
            key={semester.id}
            className={`bg-white p-6 rounded-lg shadow ${semester.isActive ? 'border-2 border-green-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{semester.name}</h3>
              {semester.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                  กำลังใช้งาน
                </span>
              )}
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">เริ่ม:</span>{' '}
                {new Date(semester.startDate).toLocaleDateString('th-TH')}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">สิ้นสุด:</span>{' '}
                {new Date(semester.endDate).toLocaleDateString('th-TH')}
              </p>
            </div>
            <div className="flex gap-2">
              {!semester.isActive && (
                <button
                  onClick={() => activateSemester(semester.id)}
                  className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                >
                  เปิดใช้งาน
                </button>
              )}
              <button
                onClick={() => deleteSemester(semester.id)}
                className="flex-1 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {semesters.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
          ไม่พบข้อมูลภาคเรียน
        </div>
      )}
    </div>
  );
};

export default SemesterManagementPage;
