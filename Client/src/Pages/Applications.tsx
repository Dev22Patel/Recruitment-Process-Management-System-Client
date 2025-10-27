// src/Pages/Applications.tsx
import { useState, useEffect } from 'react';
import { FileText, Briefcase, MapPin, Calendar, AlertCircle, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

interface Application {
  applicationId: string;
  jobPositionId: string;
  jobTitle: string;
  department: string;
  location: string;
  applicationDate: string;
  currentStatus: string;
  statusReason?: string;
}

interface ApplicationsProps {
  isProfileComplete: boolean;
}

export const Applications = ({ isProfileComplete }: ApplicationsProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (isProfileComplete) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [isProfileComplete]);

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
        if (response.status === 401) throw new Error('Unauthorized access. Please log in again.');
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'screening':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'selected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return <FileText className="h-5 w-5" />;
      case 'screening':
        return <Eye className="h-5 w-5" />;
      case 'interview':
        return <Clock className="h-5 w-5" />;
      case 'selected':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredApplications = applications.filter(app =>
    filterStatus === 'all' || app.currentStatus?.toLowerCase() === filterStatus
  );

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">My Applications</h1>
          <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
                <p className="text-yellow-800">Complete your profile to apply for jobs and view your applications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="border-2 border-red-600 bg-red-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => { setError(''); setLoading(true); fetchApplications(); }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">My Applications</h1>
          <p className="text-lg text-gray-600">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
            {filterStatus !== 'all' && ` with status: ${filterStatus}`}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('applied')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'applied'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Applied
          </button>
          <button
            onClick={() => setFilterStatus('screening')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'screening'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            Screening
          </button>
          <button
            onClick={() => setFilterStatus('interview')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'interview'
                ? 'bg-purple-600 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            Interview
          </button>
          <button
            onClick={() => setFilterStatus('selected')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'selected'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            Selected
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">
              {filterStatus === 'all' ? 'No applications yet' : `No ${filterStatus} applications`}
            </p>
            <p className="text-gray-500">
              {filterStatus === 'all'
                ? 'Start applying for jobs to see your applications here'
                : 'Try selecting a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.applicationId}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{app.jobTitle}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="h-4 w-4 flex-shrink-0" />
                          <span>{app.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>
                            Applied on {new Date(app.applicationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold whitespace-nowrap ${getStatusColor(app.currentStatus)}`}>
                      {getStatusIcon(app.currentStatus)}
                      <span className="capitalize">{app.currentStatus}</span>
                    </div>
                  </div>

                  {app.statusReason && (
                    <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Status Note:</h4>
                      <p className="text-sm text-gray-700">{app.statusReason}</p>
                    </div>
                  )}

                  {selectedApplication === app.applicationId && (
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Application ID:</span>
                          <p className="text-gray-600 font-mono mt-1">{app.applicationId}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Job Position ID:</span>
                          <p className="text-gray-600 font-mono mt-1">{app.jobPositionId}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedApplication(
                      selectedApplication === app.applicationId ? null : app.applicationId
                    )}
                    className="mt-4 text-sm font-semibold text-gray-700 hover:text-black transition-colors"
                  >
                    {selectedApplication === app.applicationId ? '▲ Hide Details' : '▼ Show Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
