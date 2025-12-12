import { useState, useEffect } from 'react';
import axios from 'axios';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'URGENT';
  isPinned: boolean;
  publishDate: string;
  expiryDate?: string;
  createdBy: string;
  creator: {
    fullName: string;
  };
}

const API_URL = 'http://localhost:3000';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'INFO' as 'INFO' | 'WARNING' | 'URGENT',
    isPinned: false,
    expiryDate: '',
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchAnnouncements();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      alert('ไม่สามารถโหลดข้อมูลประกาศได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/announcements`,
        {
          ...formData,
          expiryDate: formData.expiryDate || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('เพิ่มประกาศสำเร็จ');
      setShowForm(false);
      setFormData({
        title: '',
        content: '',
        type: 'INFO',
        isPinned: false,
        expiryDate: '',
      });
      fetchAnnouncements();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      alert(error.response?.data?.message || 'ไม่สามารถเพิ่มประกาศได้');
    }
  };

  const handlePin = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/announcements/${id}/pin`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error pinning announcement:', error);
      alert('ไม่สามารถปักหมุดประกาศได้');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบประกาศนี้หรือไม่?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('ลบประกาศสำเร็จ');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('ไม่สามารถลบประกาศได้');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'ข่าวสาร';
      case 'WARNING':
        return 'คำเตือน';
      case 'URGENT':
        return 'เร่งด่วน';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeCardColor = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'border-l-blue-500';
      case 'WARNING':
        return 'border-l-yellow-500';
      case 'URGENT':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const isStaff = currentUser?.role === 'STAFF' || currentUser?.role === 'DEPARTMENT_HEAD';

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
        <h1 className="text-3xl font-bold">ประกาศ</h1>
        {isStaff && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'ปิด' : '+ เพิ่มประกาศ'}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && isStaff && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">เพิ่มประกาศใหม่</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">หัวข้อ</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">เนื้อหา</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={6}
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
                    type: e.target.value as 'INFO' | 'WARNING' | 'URGENT',
                  })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="INFO">ข่าวสาร</option>
                <option value="WARNING">คำเตือน</option>
                <option value="URGENT">เร่งด่วน</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                วันหมดอายุ (ถ้ามี)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) =>
                  setFormData({ ...formData, isPinned: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="isPinned" className="text-sm font-medium">
                ปักหมุดประกาศนี้
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                เผยแพร่
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

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            ไม่มีประกาศในขณะนี้
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getTypeCardColor(
                announcement.type
              )}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">{announcement.title}</h2>
                    {announcement.isPinned && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        📌 ปักหมุด
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 border rounded text-xs font-medium ${getTypeBadgeColor(
                        announcement.type
                      )}`}
                    >
                      {getTypeLabel(announcement.type)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    โดย {announcement.creator.fullName} •{' '}
                    {new Date(announcement.publishDate).toLocaleDateString(
                      'th-TH',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                    {announcement.expiryDate && (
                      <span className="text-red-600">
                        {' '}
                        • หมดอายุ:{' '}
                        {new Date(announcement.expiryDate).toLocaleDateString(
                          'th-TH'
                        )}
                      </span>
                    )}
                  </p>
                </div>
                {isStaff && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePin(announcement.id)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm"
                    >
                      {announcement.isPinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
