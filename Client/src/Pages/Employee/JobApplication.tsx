import { useState, useEffect } from 'react';
import { Briefcase, Users, Search, ArrowLeft } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applicationCount: number;
}

interface Application {
  id: string;
  candidateName: string;
  candidateEmail: string;
  applicationDate: string;
  statusName: string;
  matchingSkillsCount?: number;
  candidateSkills?: string[];
}

export const JobApplications = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/JobPositions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId: string) => {
    setLoadingApps(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:7057/api/Application/job/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    fetchJobApplications(jobId);
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const filteredApplications = applications.filter(app =>
    searchQuery === '' ||
    app.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.candidateEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Job Applications</h1>
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedJobId) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">Job Applications</h1>
            <p className="text-lg text-gray-600">Select a job position to view its applications</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobSelect(job.id)}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-black rounded-lg">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-semibold">{job.applicationCount || 0}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{job.department}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setSelectedJobId(null)}
          className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Jobs
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{selectedJob?.title}</h1>
          <p className="text-lg text-gray-600">
            {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
            />
          </div>
        </div>

        {/* Applications */}
        {loadingApps ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-black border-t-transparent"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div key={app.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{app.candidateName}</h3>
                    <p className="text-gray-600 mb-3">{app.candidateEmail}</p>

                    {app.candidateSkills && app.candidateSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {app.candidateSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Applied: {new Date(app.applicationDate).toLocaleDateString()}</span>
                      {app.matchingSkillsCount !== undefined && (
                        <span className="font-semibold text-green-600">
                          {app.matchingSkillsCount} matching skills
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 border-2 border-blue-200 rounded-lg font-semibold text-center">
                      {app.statusName}
                    </span>
                    <button className="px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
                      View Details
                    </button>
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
