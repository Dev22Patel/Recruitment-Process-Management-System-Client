// Pages/Admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { Users, UserPlus, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import AddEmployeeModal from './AddEmployeeModel';
import EmployeeList from './EmployeeList';

interface AdminStats {
  totalEmployees: number;
  activeRecruiters: number;
  activeInterviewers: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats>({
    totalEmployees: 0,
    activeRecruiters: 0,
    activeInterviewers: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats();
    }
  }, [activeTab]);

  const fetchAdminStats = async () => {
    setIsLoadingStats(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {
          totalEmployees: 0,
          activeRecruiters: 0,
          activeInterviewers: 0
        });
      } else {
        toast.error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      toast.error('An error occurred while fetching statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    // Refresh stats when modal closes (after adding employee)
    if (activeTab === 'overview') {
      fetchAdminStats();
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/40">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.firstName}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'overview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'employees'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Employees
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {isLoadingStats ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Employees</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <UserPlus className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Recruiters</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeRecruiters}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Interviewers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeInterviewers}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'employees' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Employee Management</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
            <EmployeeList />
          </div>
        )}
      </div>

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default AdminDashboard;
