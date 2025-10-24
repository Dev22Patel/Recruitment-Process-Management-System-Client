import { useState, useEffect } from 'react';
import { Briefcase, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';

interface Application {
  id: string;
  jobTitle: string;
  applicationDate: string;
  status: string;
  skillMatchPercentage: number;
  matchedRequiredSkills: number;
  totalRequiredSkills: number;
  matchedPreferredSkills: number;
  totalPreferredSkills: number;
}

export const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch('https://localhost:7057/api/Application/my-applications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selected':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'applied':
      case 'screening':
      case 'interview':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      default:
        return <Briefcase className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">My Applications</h1>
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">My Applications</h1>
          <Alert className="border-red-600">
            <AlertDescription className="text-base">{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">My Applications</h1>
          <p className="text-lg text-gray-600">
            {applications.length} {applications.length === 1 ? 'application' : 'applications'} submitted
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No applications yet</p>
            <p className="text-gray-500">Start applying for positions to see them here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="border-2 border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">{application.jobTitle}</h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-5 w-5" />
                      <span>
                        Applied on{' '}
                        {new Date(application.applicationDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    <span
                      className={`px-4 py-2 border-2 font-semibold rounded-lg ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-700">Skill Match</span>
                    </div>
                    <p className="text-3xl font-bold">{application.skillMatchPercentage}%</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-700">Required Skills</span>
                    </div>
                    <p className="text-3xl font-bold">
                      {application.matchedRequiredSkills}/{application.totalRequiredSkills}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-gray-700" />
                      <span className="font-semibold text-gray-700">Preferred Skills</span>
                    </div>
                    <p className="text-3xl font-bold">
                      {application.matchedPreferredSkills}/{application.totalPreferredSkills}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
