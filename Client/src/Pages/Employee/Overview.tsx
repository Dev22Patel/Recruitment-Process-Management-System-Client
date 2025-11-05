import { useEffect, useState } from 'react';
import { applicationService } from '@/Services/ApplicationService';
import { jobPositionService } from '@/Services/JobPositionService';
import type { ApplicationStatistics } from '@/types/application.types';
import StatisticsCard from '@/Components/Employee/StatisticsCard';
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

const Overview = () => {
  const [stats, setStats] = useState<ApplicationStatistics | null>(null);
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statistics, jobs] = await Promise.all([
          applicationService.getApplicationStatistics(),
          jobPositionService.getAllJobPositions(),
        ]);
        setStats(statistics);
        setJobCount(jobs.length);
      } catch (error) {
        console.error('Error fetching overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={FileText}
          description="All time applications"
        />
        <StatisticsCard
          title="Pending Review"
          value={stats?.pendingApplications || 0}
          icon={Clock}
          description="Awaiting screening"
        />
        <StatisticsCard
          title="In Interview"
          value={stats?.inInterviewApplications || 0}
          icon={Users}
          description="Active interviews"
        />
        <StatisticsCard
          title="Selected"
          value={stats?.selectedApplications || 0}
          icon={CheckCircle}
          description="Candidates hired"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Active Job Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{jobCount}</div>
            <p className="text-sm text-muted-foreground">Total openings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              In Screening
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.inScreeningApplications || 0}</div>
            <p className="text-sm text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.rejectedApplications || 0}</div>
            <p className="text-sm text-muted-foreground">Not selected</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
              <Briefcase className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-semibold">Create Job Position</h3>
              <p className="text-sm text-muted-foreground">Post a new opening</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-semibold">Review Applications</h3>
              <p className="text-sm text-muted-foreground">Check pending reviews</p>
            </button>
            <button className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-semibold">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Detailed reports</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
