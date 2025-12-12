import { useState, useEffect } from 'react';
import {
  specialDateService,
  SpecialDate,
  SpecialDateType,
  CreateSpecialDateDto,
} from '../services/special-date.service';
import { semesterService, Semester } from '../services/semester.service';
import { Star, Plus, Trash2, AlertCircle, Calendar } from 'lucide-react';

const SpecialDatesPage = () => {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateSpecialDateDto>({
    name: '',
    date: '',
    type: SpecialDateType.HOLIDAY,
    description: '',
    semesterId: '',
  });

  useEffect(() => {
    fetchSpecialDates();
    fetchSemesters();
  }, [selectedMonth, selectedYear]);

  const fetchSpecialDates = async () => {
    try {
      setLoading(true);
      const data = await specialDateService.getByMonth(selectedMonth, selectedYear);
      setSpecialDates(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถดึงข้อมูลวันพิเศษได้');
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async () => {
    try {
      const data = await semesterService.getAll();
      setSemesters(data);
    } catch (err: any) {
      console.error('Error fetching semesters:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await specialDateService.update(editingId, formData);
      } else {
        await specialDateService.create(formData);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        date: '',
        type: SpecialDateType.HOLIDAY,
        description: '',
        semesterId: '',
      });
      fetchSpecialDates();
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const handleEdit = (specialDate: SpecialDate) => {
    setEditingId(specialDate.id);
    setFormData({
      name: specialDate.name,
      date: specialDate.date.split('T')[0],
      type: specialDate.type,
      description: specialDate.description,
      semesterId: specialDate.semesterId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบวันพิเศษนี้หรือไม่?')) return;

    try {
      await specialDateService.delete(id);
      fetchSpecialDates();
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่สามารถลบวันพิเศษได้');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      date: '',
      type: SpecialDateType.HOLIDAY,
      description: '',
      semesterId: '',
    });
    setError('');
  };

  const getTypeLabel = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.HOLIDAY:
        return 'วันหยุด';
      case SpecialDateType.EXAM:
        return 'วันสอบ';
      case SpecialDateType.EVENT:
        return 'วันพิเศษ';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: SpecialDateType) => {
    switch (type) {
      case SpecialDateType.HOLIDAY:
        return 'badge-danger';
      case SpecialDateType.EXAM:
        return 'badge-warning';
      case SpecialDateType.EVENT:
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
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
          <Star className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">จัดการวันพิเศษ</h1>
            <p className="text-sm text-muted-foreground">จัดการวันหยุด วันสอบ และวันพิเศษต่างๆ</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          เพิ่มวันพิเศษ
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex gap-4 items-center">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <label className="font-semibold text-sm">เลือกเดือน/ปี:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="input"
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
            className="input"
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
        <div className="bg-card border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'แก้ไขวันพิเศษ' : 'เพิ่มวันพิเศษใหม่'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อวันพิเศษ *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input w-full"
                placeholder="เช่น วันหยุดกลางปี"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">วันที่ *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input w-full"
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
                    type: e.target.value as SpecialDateType,
                  })
                }
                className="input w-full"
              >
                <option value={SpecialDateType.HOLIDAY}>วันหยุด</option>
                <option value={SpecialDateType.EXAM}>วันสอบ</option>
                <option value={SpecialDateType.EVENT}>วันพิเศษ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ภาคเรียน (ถ้ามี)</label>
              <select
                value={formData.semesterId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, semesterId: e.target.value || undefined })
                }
                className="input w-full"
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
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input w-full"
                rows={3}
                placeholder="รายละเอียดเพิ่มเติม..."
              />
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

      {/* Special Dates List */}
      <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                วันที่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ชื่อวันพิเศษ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                รายละเอียด
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {specialDates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <Star className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">ไม่มีวันพิเศษในเดือนนี้</p>
                </td>
              </tr>
            ) : (
              specialDates.map((date) => (
                <tr key={date.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(date.date).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 font-medium">{date.name}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getTypeBadgeColor(date.type)}`}>
                      {getTypeLabel(date.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                    {date.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(date)}
                        className="text-primary hover:text-primary/80"
                        title="แก้ไข"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(date.id)}
                        className="text-destructive hover:text-destructive/80"
                        title="ลบ"
                      >
                        ลบ
                      </button>
                    </div>
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
