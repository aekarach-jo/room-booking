import { useState, useEffect } from 'react';
import {
  announcementService,
  Announcement,
  AnnouncementType,
  CreateAnnouncementDto,
} from '../services/announcement.service';
import { useAuth } from '../context/AuthContext';
import { Bell, Plus, Pin, Trash2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAnnouncementDto>({
    title: '',
    content: '',
    type: AnnouncementType.INFO,
    expiryDate: '',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await announcementService.getAll();
      setAnnouncements(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลประกาศได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = {
        ...formData,
        expiryDate: formData.expiryDate || undefined,
      };

      if (editingId) {
        await announcementService.update(editingId, submitData);
      } else {
        await announcementService.create(submitData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        content: '',
        type: AnnouncementType.INFO,
        expiryDate: '',
      });
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      expiryDate: announcement.expiryDate ? announcement.expiryDate.split('T')[0] : '',
    });
    setShowForm(true);
  };

  const handlePin = async (id: string) => {
    try {
      await announcementService.togglePin(id);
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถปักหมุดประกาศได้');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบประกาศนี้หรือไม่?')) return;

    try {
      await announcementService.delete(id);
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถลบประกาศได้');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      type: AnnouncementType.INFO,
      expiryDate: '',
    });
    setError('');
  };

  const getTypeLabel = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.INFO:
        return 'ข่าวสาร';
      case AnnouncementType.WARNING:
        return 'คำเตือน';
      case AnnouncementType.URGENT:
        return 'เร่งด่วน';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.INFO:
        return 'badge-info';
      case AnnouncementType.WARNING:
        return 'badge-warning';
      case AnnouncementType.URGENT:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const getTypeIcon = (type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.INFO:
        return <Info className="w-5 h-5" />;
      case AnnouncementType.WARNING:
        return <AlertTriangle className="w-5 h-5" />;
      case AnnouncementType.URGENT:
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const isStaff = user?.role === 'STAFF' || user?.role === 'DEPARTMENT_HEAD';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">ประกาศ</h1>
            <p className="text-sm text-muted-foreground">ข่าวสารและประกาศสำคัญ</p>
          </div>
        </div>
        {isStaff && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            เพิ่มประกาศ
          </button>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && isStaff && (
        <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'แก้ไขประกาศ' : 'เพิ่มประกาศใหม่'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">หัวข้อ *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input w-full"
                placeholder="หัวข้อประกาศ"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">เนื้อหา *</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="input w-full"
                rows={6}
                placeholder="เนื้อหาประกาศ..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ประเภท *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as AnnouncementType,
                  })
                }
                className="input w-full"
              >
                <option value={AnnouncementType.INFO}>ข่าวสาร</option>
                <option value={AnnouncementType.WARNING}>คำเตือน</option>
                <option value={AnnouncementType.URGENT}>เร่งด่วน</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                วันหมดอายุ (ถ้ามี)
              </label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="input w-full"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'บันทึก' : 'เผยแพร่'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
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
          <div className="bg-card border rounded-lg p-8 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">ไม่มีประกาศในขณะนี้</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(announcement.type)}
                      <h2 className="text-xl font-semibold">{announcement.title}</h2>
                    </div>
                    {announcement.isPinned && (
                      <span className="badge badge-warning flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        ปักหมุด
                      </span>
                    )}
                    <span className={`badge ${getTypeBadgeColor(announcement.type)}`}>
                      {getTypeLabel(announcement.type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    โดย {announcement.creator?.fullName || 'ไม่ระบุ'} •{' '}
                    {new Date(announcement.publishDate).toLocaleDateString(
                      'th-TH',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                    {announcement.expiryDate && (
                      <span className="text-destructive">
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
                      className="btn btn-sm btn-secondary"
                      title={announcement.isPinned ? 'เลิกปักหมุด' : 'ปักหมุด'}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="btn btn-sm btn-secondary"
                      title="แก้ไข"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="btn btn-sm btn-danger"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="whitespace-pre-wrap">
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
