import { useState, useEffect } from 'react';
import {
  semesterService,
  Semester,
  CreateSemesterDto,
} from '../services/semester.service';
import { Calendar, Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const SemesterManagementPage = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSemesterDto>({
    name: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const data = await semesterService.getAll();
      setSemesters(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลภาคเรียนได้');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await semesterService.update(editingId, formData);
      } else {
        await semesterService.create(formData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', startDate: '', endDate: '' });
      fetchSemesters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (semester: Semester) => {
    setEditingId(semester.id);
    setFormData({
      name: semester.name,
      startDate: semester.startDate.split('T')[0],
      endDate: semester.endDate.split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบภาคเรียนนี้หรือไม่?')) return;

    try {
      await semesterService.delete(id);
      fetchSemesters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถลบภาคเรียนได้');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await semesterService.activate(id);
      fetchSemesters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถเปิดใช้งานภาคเรียนได้');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', startDate: '', endDate: '' });
    setError('');
  };

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
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">จัดการภาคเรียน</h1>
            <p className="text-sm text-muted-foreground">จัดการข้อมูลภาคเรียนทั้งหมด</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          เพิ่มภาคเรียน
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'แก้ไขภาคเรียน' : 'เพิ่มภาคเรียนใหม่'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ชื่อภาคเรียน *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น เทอม 1/2568"
                className="input w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  วันเริ่มต้น *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  วันสิ้นสุด *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'บันทึก' : 'เพิ่ม'}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {semesters.length === 0 ? (
          <div className="col-span-full bg-card border rounded-lg p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">ยังไม่มีภาคเรียน</p>
          </div>
        ) : (
          semesters.map((semester) => (
            <div
              key={semester.id}
              className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{semester.name}</h3>
                    {semester.isActive && (
                      <span className="badge badge-success flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        ใช้งานอยู่
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      วันเริ่มต้น: {new Date(semester.startDate).toLocaleDateString('th-TH')}
                    </p>
                    <p>
                      วันสิ้นสุด: {new Date(semester.endDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!semester.isActive && (
                  <button
                    onClick={() => handleActivate(semester.id)}
                    className="btn btn-sm btn-success flex-1"
                    title="เปิดใช้งาน"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    เปิดใช้งาน
                  </button>
                )}
                <button
                  onClick={() => handleEdit(semester)}
                  className="btn btn-sm btn-secondary"
                  title="แก้ไข"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(semester.id)}
                  className="btn btn-sm btn-danger"
                  title="ลบ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SemesterManagementPage;
