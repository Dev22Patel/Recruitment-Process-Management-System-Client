import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, ChevronRight, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface Job {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  experienceRange?: string;
  salary?: number;
  postedDate: string;
  requiredSkills: string[];
  preferredSkills: string[];
}

interface JobsProps {
  isProfileComplete: boolean;
}

export const Jobs = ({ isProfileComplete }: JobsProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('all');

  useEffect(() => {
    if (isProfileComplete) fetchJobs();
  }, [isProfileComplete]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      const response = await fetch('https://localhost:7057/api/JobPositions/active', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized access. Please log in again.');
        if (response.status === 404) throw new Error('No active jobs found.');
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }
      const data = await response.json();
      const sortedJobs = data.sort((a: Job, b: Job) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
      setJobs(sortedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Open Positions</h1>
          <Alert className="border-black">
            <AlertDescription className="text-base">Complete your profile to view and apply for positions.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Open Positions</h1>
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
          <h1 className="text-4xl font-bold mb-6">Open Positions</h1>
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
          <h1 className="text-4xl font-bold mb-3">Open Positions</h1>
          <p className="text-lg text-gray-600">{jobs.length} {jobs.length === 1 ? 'position' : 'positions'} available</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Search jobs by title, skills, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-gray-200 rounded-lg focus:border-black focus:ring-0"
              />
            </div>
            <div className="flex gap-4 w-full md:w-1/2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full border-2 border-gray-200 focus:border-black focus:ring-0">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="product-development">Product Development</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full border-2 border-gray-200 focus:border-black focus:ring-0">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid-mumbai">Hybrid - Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Select value={employmentTypeFilter} onValueChange={setEmploymentTypeFilter}>
              <SelectTrigger className="w-full border-2 border-gray-200 focus:border-black focus:ring-0">
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
              <SelectTrigger className="w-full border-2 border-gray-200 focus:border-black focus:ring-0">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry</SelectItem>
                <SelectItem value="mid">Mid</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No open positions at this time</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black transition-all duration-200">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-3">{job.title}</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3 text-base">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="h-5 w-5 flex-shrink-0" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <MapPin className="h-5 w-5 flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-5 w-5 flex-shrink-0" />
                          <span>{job.employmentType}</span>
                        </div>
                        {job.salary !== undefined && (
                          <div className="flex items-center gap-2 text-gray-700 font-semibold">
                            <DollarSign className="h-5 w-5 flex-shrink-0" />
                            <span>${job.salary.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg">
                      {job.experienceLevel}
                    </span>
                    {job.experienceRange && (
                      <span className="px-4 py-2 border-2 border-gray-300 text-sm font-semibold rounded-lg">
                        {job.experienceRange}+ Years Required
                      </span>
                    )}
                  </div>

                  {selectedJob === job.id && (
                    <div className="space-y-6 pt-6 border-t-2 border-gray-200 transition-all duration-300 ease-in-out">
                      <div>
                        <h3 className="text-lg font-bold mb-3">Job Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description || 'No description available.'}</p>
                      </div>

                      {job.requiredSkills?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Required Skills</h3>
                          <div className="flex flex-wrap gap-3">
                            {job.requiredSkills.map((skill, index) => (
                              <div key={`${skill}-${index}`} className="px-4 py-2 bg-black text-white font-medium rounded-lg">
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.preferredSkills?.length > 0 && (
                        <div>
                          <h3 className="text-lg font-bold mb-3">Preferred Skills</h3>
                          <div className="flex flex-wrap gap-3">
                            {job.preferredSkills.map((skill, index) => (
                              <div key={`${skill}-${index}`} className="px-4 py-2 border-2 border-gray-300 font-medium rounded-lg">
                                {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-600 pt-4">
                        <Calendar className="h-5 w-5" />
                        <span>Posted on {new Date(job.postedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {selectedJob === job.id ? 'Show Less' : 'View Details'}
                      <ChevronRight className={`h-5 w-5 transition-transform ${selectedJob === job.id ? 'rotate-90' : ''}`} />
                    </button>
                    <button
                      onClick={() => alert(`Application for ${job.title} initiated!`)}
                      className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Apply Now
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
