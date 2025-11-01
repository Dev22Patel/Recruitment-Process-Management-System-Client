// src/Pages/Jobs.tsx
import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, ChevronRight, Search, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [checkingEligibility, setCheckingEligibility] = useState<string | null>(null);
  const [applyingForJob, setApplyingForJob] = useState<string | null>(null);
  const [eligibilityResults, setEligibilityResults] = useState<{[key: string]: any}>({});

  useEffect(() => {
    if (isProfileComplete) {
      fetchJobs();
      fetchAppliedJobs();
    }
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
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      const sortedJobs = data.sort((a: Job, b: Job) =>
        new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
      setJobs(sortedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (jobId: string) => {
  setCheckingEligibility(jobId);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://localhost:7057/api/Application/check-eligibility/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData); // Add this
      throw new Error(errorData.message || 'Failed to check eligibility');
    }

    const result = await response.json();
    console.log('Eligibility result:', result); // Add this
    setEligibilityResults(prev => ({
      ...prev,
      [jobId]: result
    }));
    // ... rest of your code
  } catch (err) {
    console.error('Full error:', err); // Add this
    alert('Failed to check eligibility. Please try again.');
  } finally {
    setCheckingEligibility(null);
  }
};

  const applyForJob = async (jobId: string, jobTitle: string) => {
    // Check eligibility first if not already checked
    if (!eligibilityResults[jobId]) {
      alert('Please check your eligibility first before applying.');
      return;
    }

    if (!eligibilityResults[jobId].isEligible) {
      alert('You are not eligible to apply for this position. Please check the eligibility requirements.');
      return;
    }

    if (!confirm(`Are you sure you want to apply for ${jobTitle}?`)) {
      return;
    }

    setApplyingForJob(jobId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:7057/api/Application/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobPositionId: jobId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit application');
      }

      const result = await response.json();
      alert(
        `🎉 Success! ${result.message}\n\n` +
        `📊 Your skill match: ${result.application.skillMatchPercentage}%\n` +
        `✓ Required Skills: ${result.application.matchedRequiredSkills}/${result.application.totalRequiredSkills}\n` +
        `✓ Preferred Skills: ${result.application.matchedPreferredSkills}/${result.application.totalPreferredSkills}\n\n` +
        `We will review your application and get back to you soon.`
      );

      // Clear eligibility result after successful application
      setEligibilityResults(prev => {
        const newResults = { ...prev };
        delete newResults[jobId];
        return newResults;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
    } finally {
      setApplyingForJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.preferredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment = departmentFilter === 'all' ||
      job.department.toLowerCase().replace(/\s+/g, '-') === departmentFilter;

    const matchesLocation = locationFilter === 'all' ||
      job.location.toLowerCase().replace(/\s+/g, '-') === locationFilter;

    const matchesEmploymentType = employmentTypeFilter === 'all' ||
      job.employmentType.toLowerCase().replace(/\s+/g, '-') === employmentTypeFilter;

    const matchesExperienceLevel = experienceLevelFilter === 'all' ||
      job.experienceLevel.toLowerCase() === experienceLevelFilter;

    return matchesSearch && matchesDepartment && matchesLocation &&
           matchesEmploymentType && matchesExperienceLevel;
  });

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Open Positions</h1>
          <div className="border-2 border-yellow-400 bg-yellow-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
                <p className="text-yellow-800">Complete your profile to view and apply for positions.</p>
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
          <div className="border-2 border-red-600 bg-red-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                <p className="text-red-800">{error}</p>
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
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Open Positions</h1>
          <p className="text-lg text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'} available
            {filteredJobs.length !== jobs.length && ` (filtered from ${jobs.length} total)`}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base bg-white"
            >
              <option value="all">All Departments</option>
              <option value="product-development">Product Development</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base bg-white"
            >
              <option value="all">All Locations</option>
              <option value="mumbai">Mumbai</option>
              <option value="remote">Remote</option>
              <option value="hybrid-mumbai">Hybrid - Mumbai</option>
            </select>

            <select
              value={employmentTypeFilter}
              onChange={(e) => setEmploymentTypeFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base bg-white"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>

            <select
              value={experienceLevelFilter}
              onChange={(e) => setExperienceLevelFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-base bg-white"
            >
              <option value="all">All Levels</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-2">No positions found</p>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => {
              const eligibility = eligibilityResults[job.id];

              return (
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

                    {eligibility && (
                      <div className={`mb-6 p-4 rounded-lg border-2 ${eligibility.isEligible ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                        <div className="flex items-start gap-3">
                          {eligibility.isEligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className={`font-semibold mb-2 ${eligibility.isEligible ? 'text-green-900' : 'text-red-900'}`}>
                              {eligibility.isEligible ? '✓ You are eligible to apply!' : '✗ Not eligible to apply'}
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Skill Match:</span> {eligibility.skillMatchPercentage}%
                              </div>
                              <div>
                                <span className="font-medium">Required:</span> {eligibility.matchedRequiredSkills}/{eligibility.totalRequiredSkills}
                              </div>
                              <div>
                                <span className="font-medium">Preferred:</span> {eligibility.matchedPreferredSkills}/{eligibility.totalPreferredSkills}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedJob === job.id && (
                      <div className="space-y-6 pt-6 border-t-2 border-gray-200 mb-6">
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

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                        className="flex items-center gap-2 px-6 py-3 border-2 border-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {selectedJob === job.id ? 'Show Less' : 'View Details'}
                        <ChevronRight className={`h-5 w-5 transition-transform ${selectedJob === job.id ? 'rotate-90' : ''}`} />
                      </button>

                      <button
                        onClick={() => checkEligibility(job.id)}
                        disabled={checkingEligibility === job.id}
                        className="px-6 py-3 border-2 border-black font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkingEligibility === job.id ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                            Checking...
                          </>
                        ) : eligibility ? (
                          eligibility.isEligible ? '✓ Eligible' : '✗ Not Eligible'
                        ) : (
                          'Check Eligibility'
                        )}
                      </button>

                      <button
                        onClick={() => applyForJob(job.id, job.title)}
                        disabled={applyingForJob === job.id || !eligibility || !eligibility.isEligible}
                        className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {applyingForJob === job.id ? (
                          <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Applying...
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to apply for <strong>{jobToApply?.title}</strong>?
              This action will submit your profile and resume to Roima's recruitment team.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={applyForJob}>
              Yes, Apply Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <AlertDialogTitle>Application Submitted!</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your application has been successfully submitted to Roima. Our recruitment team will review your profile and get back to you soon.
              You can track your application status in the "My Applications" section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
