import { useEffect, useState } from 'react';
import { applicationService } from '@/Services/ApplicationService';
import { jobPositionService } from '@/Services/JobPositionService';
import type { ApplicationStatistics } from '@/Types/application.types';
import type { JobPosition } from '@/Types/job.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import StatisticsCard from '@/Components/Employee/StatisticsCard';
import { Users, FileText, CheckCircle, XCircle, Clock, TrendingUp, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<ApplicationStatistics | null>(null);
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [selectedJob]);

  const fetchInitialData = async () => {
    try {
      const jobsData = await jobPositionService.getAllJobPositions();
      setJobs(jobsData);
    } catch (error) {
      toast.error('Failed to fetch jobs data');
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const statsData = await applicationService.getApplicationStatistics(
        selectedJob === 'all' ? undefined : selectedJob
      );
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const conversionRate = stats && stats.totalApplications > 0
    ? Math.round((stats.selectedApplications / stats.totalApplications) * 100)
    : 0;

  const rejectionRate = stats && stats.totalApplications > 0
    ? Math.round((stats.rejectedApplications / stats.totalApplications) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your recruitment metrics and insights</p>
        </div>
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select job position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Job Positions</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={FileText}
          description="All applications received"
        />
        <StatisticsCard
          title="Pending Review"
          value={stats?.pendingApplications || 0}
          icon={Clock}
          description="Awaiting initial screening"
        />
        <StatisticsCard
          title="In Progress"
          value={(stats?.inScreeningApplications || 0) + (stats?.inInterviewApplications || 0)}
          icon={Users}
          description="Screening + Interview"
        />
        <StatisticsCard
          title="Selected"
          value={stats?.selectedApplications || 0}
          icon={CheckCircle}
          description="Successfully hired"
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Applied</span>
                  <span className="text-sm text-gray-600">{stats?.pendingApplications || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${stats && stats.totalApplications > 0
                        ? (stats.pendingApplications / stats.totalApplications) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Screening</span>
                  <span className="text-sm text-gray-600">{stats?.inScreeningApplications || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${stats && stats.totalApplications > 0
                        ? (stats.inScreeningApplications / stats.totalApplications) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Interview</span>
                  <span className="text-sm text-gray-600">{stats?.inInterviewApplications || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${stats && stats.totalApplications > 0
                        ? (stats.inInterviewApplications / stats.totalApplications) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Selected</span>
                  <span className="text-sm text-gray-600">{stats?.selectedApplications || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${stats && stats.totalApplications > 0
                        ? (stats.selectedApplications / stats.totalApplications) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Rejected</span>
                  <span className="text-sm text-gray-600">{stats?.rejectedApplications || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{
                      width: `${stats && stats.totalApplications > 0
                        ? (stats.rejectedApplications / stats.totalApplications) * 100
                        : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Selected / Total Applications</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Rejection Rate</p>
                <p className="text-2xl font-bold text-red-600">{rejectionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Rejected / Total Applications</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Openings</p>
                <p className="text-2xl font-bold text-blue-600">{jobs.filter(j => j.statusId === 1).length}</p>
                <p className="text-xs text-gray-500 mt-1">Currently accepting applications</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats && (
              <>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-medium">Total Applications</span>
                  <span className="text-2xl font-bold">{stats.totalApplications}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">↓ Screening Stage</span>
                  <span className="font-semibold">{stats.inScreeningApplications}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">↓ Interview Stage</span>
                  <span className="font-semibold">{stats.inInterviewApplications}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-green-600 font-medium">✓ Selected</span>
                  <span className="text-green-600 font-bold">{stats.selectedApplications}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
