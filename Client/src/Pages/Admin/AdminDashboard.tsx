import { useState, useEffect } from 'react';
import { useAuth } from '@/Context/AuthContext';
import { Users, UserPlus, LogOut, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'sonner';
import AddEmployeeDrawer from './AddEmployeeDrawer';
import EmployeeList from './EmployeeList';

interface AdminStats {
  totalEmployees: number;
  activeRecruiters: number;
  activeInterviewers: number;
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'employees'>('overview');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
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

  const handleDrawerSuccess = () => {
    fetchAdminStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Welcome back, <span className="font-medium text-gray-900">{user?.firstName}</span>
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all hover:shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-lg p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 font-medium rounded-md transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-2.5 font-medium rounded-md transition-all ${
              activeTab === 'employees'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Employees
          </button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {isLoadingStats ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading statistics...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Employees Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalEmployees}</p>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="w-3 h-3" />
                        <span>Active workforce</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Active Recruiters Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Recruiters</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeRecruiters}</p>
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <Activity className="w-3 h-3" />
                        <span>Hiring team</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Active Interviewers Card */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">Active Interviewers</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stats.activeInterviewers}</p>
                      <div className="flex items-center gap-1 text-xs text-purple-600">
                        <Activity className="w-3 h-3" />
                        <span>Interview panel</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                      <Users className="w-6 h-6 text-white" />
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your team members and their roles</p>
              </div>
              <button
                onClick={() => setIsAddDrawerOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
            <EmployeeList />
          </div>
        )}
      </div>

      <AddEmployeeDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onSuccess={handleDrawerSuccess}
      />
    </div>
  );
};

export default AdminDashboard;
