import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  fullName: string;
  studentId?: string;
  teacherId?: string;
  department?: string;
  year?: number;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (user.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800';
      case 'TEACHER':
        return 'bg-purple-100 text-purple-800';
      case 'STAFF':
        return 'bg-green-100 text-green-800';
      case 'DEPARTMENT_HEAD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'นักศึกษา';
      case 'TEACHER':
        return 'อาจารย์';
      case 'STAFF':
        return 'เจ้าหน้าที่';
      case 'DEPARTMENT_HEAD':
        return 'หัวหน้าภาควิชา';
      default:
        return role;
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { isActive: !currentStatus });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">จัดการผู้ใช้</h1>
        <p className="text-gray-600">จัดการข้อมูลผู้ใช้ทั้งหมดในระบบ</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="ค้นหาชื่อ, username, รหัสนักศึกษา, รหัสอาจารย์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">ทุก Role</option>
            <option value="STUDENT">นักศึกษา</option>
            <option value="TEACHER">อาจารย์</option>
            <option value="STAFF">เจ้าหน้าที่</option>
            <option value="DEPARTMENT_HEAD">หัวหน้าภาควิชา</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ผู้ใช้
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                รหัส
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ภาควิชา
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.studentId || user.teacherId || '-'}
                  {user.year && <span className="ml-2 text-gray-500">ชั้นปี {user.year}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.department || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {user.isActive ? 'ใช้งาน' : 'ปิดการใช้งาน'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">ไม่พบข้อมูลผู้ใช้</div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้
      </div>
    </div>
  );
};

export default UserManagementPage;
