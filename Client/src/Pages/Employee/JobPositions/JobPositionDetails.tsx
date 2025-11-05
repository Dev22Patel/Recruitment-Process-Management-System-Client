import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobPositionService } from '@/Services/JobPositionService';
import { applicationService } from '@/Services/ApplicationService';
import type { JobPosition } from '@/types/job.types';
import type { Application } from '@/types/application.types';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import ApplicationCard from '@/Components/Employee/ApplicationCard';
import { ArrowLeft, Edit, MapPin, Briefcase, DollarSign, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner';

const JobPositionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosition | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const [jobData, applicationsData] = await Promise.all([
        jobPositionService.getJobPositionById(id!),
        applicationService.getApplicationsByJob(id!),
      ]);
      setJob(jobData);
      setApplications(applicationsData);
    } catch (error) {
      toast.error('Failed to fetch job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Job not found</h3>
        <Button className="mt-4" onClick={() => navigate('/employee/jobs')}>
          Back to Jobs
        </Button>
      </div>
    );
  }

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 1:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 2:
        return <Badge className="bg-yellow-100 text-yellow-800">On Hold</Badge>;
      case 3:
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/employee/jobs')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {getStatusBadge(job.statusId)}
          <Button onClick={() => navigate(`/employee/jobs/edit/${job.id}`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Job Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, idx) => (
                    <Badge key={idx} variant="default">
                      {skill.skillName}
                      {skill.minYearsExperience && ` (${skill.minYearsExperience}+ yrs)`}
                    </Badge>
                  ))}
                </div>
              </div>
              {job.preferredSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.preferredSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill.skillName}
                        {skill.minYearsExperience && ` (${skill.minYearsExperience}+ yrs)`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">{job.employmentType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Experience Level</p>
                  <p className="font-medium">{job.experienceLevel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">
                    {job.salary ? `₹${job.salary.toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Posted On</p>
                  <p className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="font-medium">{job.createdByName || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">{applications.length}</div>
                <p className="text-sm text-gray-500 mt-1">Total Applications</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications received yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPositionDetails;
