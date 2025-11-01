import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Sidebar } from '@/Components/layout/Sidebar';
import { AllApplications } from './AllApplication';
import { JobApplications } from './JobApplication';
import { ManageJobs } from './ManageJobPosition';

interface DashboardStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
  inScreening: number;
  inInterview: number;
  selected: number;
  rejected: number;
}

interface RecentApplication {
  id: string;
  candidateName: string;
  jobTitle: string;
  applicationDate: string;
  statusName: string;
}

export const EmployeeDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch statistics
      const statsResponse = await fetch('https://localhost:7057/api/Application/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalJobs: 0, // You'll need to add this endpoint
          activeJobs: 0,
          totalApplications: statsData.totalApplications,
          pendingApplications: statsData.pendingApplications,
          inScreening: statsData.inScreeningApplications,
          inInterview: statsData.inInterviewApplications,
          selected: statsData.selectedApplications,
          rejected: statsData.rejectedApplications
        });
      }

      // Fetch recent applications
      const appsResponse = await fetch('https://localhost:7057/api/Application/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        setRecentApplications(appsData.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Recruitment Dashboard</h1>
          <p className="text-lg text-gray-600">Welcome back! Here's what's happening with recruitment at Roima.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-1">{stats?.totalApplications || 0}</div>
            <div className="text-sm font-medium text-blue-700">Total Applications</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-600 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-900 mb-1">{stats?.pendingApplications || 0}</div>
            <div className="text-sm font-medium text-yellow-700">Pending Review</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-900 mb-1">{stats?.inInterview || 0}</div>
            <div className="text-sm font-medium text-purple-700">In Interview</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-900 mb-1">{stats?.selected || 0}</div>
            <div className="text-sm font-medium text-green-700">Selected</div>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Application Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats?.pendingApplications || 0}</div>
              <div className="text-sm text-gray-600">Applied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{stats?.inScreening || 0}</div>
              <div className="text-sm text-gray-600">Screening</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stats?.inInterview || 0}</div>
              <div className="text-sm text-gray-600">Interview</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{stats?.selected || 0}</div>
              <div className="text-sm text-gray-600">Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{stats?.rejected || 0}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent applications</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold">{app.candidateName}</h3>
                    <p className="text-sm text-gray-600">{app.jobTitle}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                      {app.statusName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
