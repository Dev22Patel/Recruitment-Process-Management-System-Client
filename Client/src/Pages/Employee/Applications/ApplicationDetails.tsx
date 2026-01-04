import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationService } from '@/Services/ApplicationService';
import type { Application, UpdateApplicationStatusDto } from '@/Types/application.types';
import { Button } from '@/Components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import ApplicationStatusBadge from '@/Components/Employee/ApplicationStatusBadge';
import { ArrowLeft, Mail,Calendar, DollarSign, FileText, Download, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<number>(4);
  const [statusReason, setStatusReason] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getApplicationById(id!);
      setApplication(data);
      setNewStatus(data.statusId);
      setStatusReason(data.statusReason || '');
    } catch (error) {
      toast.error('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };


  const handleStatusUpdate = async () => {
    if (!application) return;

    setUpdating(true);
    try {
      const updateDto: UpdateApplicationStatusDto = {
        applicationId: application.id,
        statusId: newStatus,
        statusReason: statusReason,
      };

      await applicationService.updateApplicationStatus(updateDto);
      toast.success('Application status updated successfully');
      fetchApplication();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Application not found</h3>
        <Button className="mt-4" onClick={() => navigate('/employee/applications')}>
          Back to Applications
        </Button>
      </div>
    );
  }

  const skillMatchPercentage = application.requiredSkills.length > 0
    ? Math.round((application.matchingSkillsCount / application.requiredSkills.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/employee/applications')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.candidateName}</h1>
            <p className="text-gray-600 mt-1">Applied for {application.jobTitle}</p>
          </div>
        </div>
        <ApplicationStatusBadge statusId={application.statusId} statusName={application.statusName} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Information */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{application.candidateEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Applied On</p>
                    <p className="font-medium">{new Date(application.applicationDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{application.totalExperience || 0} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Expected Salary</p>
                    <p className="font-medium">
                      {application.expectedSalary ? `₹${application.expectedSalary.toLocaleString()}` : 'Not specified'}
            </p>
            </div>
            </div>
            <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
            <p className="text-sm text-gray-500">Notice Period</p>
            <p className="font-medium">{application.noticePeriod || 0} days</p>
            </div>
            </div>
            {application.resumeFilePath && (
            <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-gray-400" />
            <div>
            <p className="text-sm text-gray-500">Resume</p>
            <a href={application.resumeFilePath} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
            Download Resume
            </a>
            </div>
            </div>
            )}
            </div>
            </CardContent>
            </Card>
           {/* Skills Match */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Skill Match</span>
              <span className="text-sm font-bold text-blue-600">{skillMatchPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${skillMatchPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {application.matchingSkillsCount} of {application.requiredSkills.length} required skills matched
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Candidate Skills</h4>
            <div className="flex flex-wrap gap-2">
              {application.candidateSkills.map((skill, idx) => {
                const isRequired = application.requiredSkills.includes(skill);
                return (
                  <Badge
                    key={idx}
                    variant={isRequired ? "default" : "secondary"}
                  >
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Required Skills (for reference)</h4>
            <div className="flex flex-wrap gap-2">
              {application.requiredSkills.map((skill, idx) => {
                const hasSkill = application.candidateSkills.includes(skill);
                return (
                  <Badge
                    key={idx}
                    variant={hasSkill ? "default" : "outline"}
                    className={!hasSkill ? "opacity-50" : ""}
                  >
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Position Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-medium text-lg">{application.jobTitle}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-medium">{application.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{application.location}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/employee/jobs/${application.jobPositionId}`)}
          >
            View Full Job Description
          </Button>
        </CardContent>
      </Card>
    </div>

    {/* Sidebar - Status Update */}
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Application Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newStatus.toString()}
              onValueChange={(value) => setNewStatus(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">Applied</SelectItem>
                <SelectItem value="5">Screening</SelectItem>
                <SelectItem value="6">Interview</SelectItem>
                <SelectItem value="7">Selected</SelectItem>
                <SelectItem value="8">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Status Reason/Notes</Label>
            <Textarea
              id="reason"
              rows={4}
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Add notes about this status change..."
            />
          </div>

          <Button
            className="w-full"
            onClick={handleStatusUpdate}
            disabled={updating || newStatus === application.statusId}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </Button>

          {application.statusReason && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-1">Current Status Notes</p>
              <p className="text-sm text-gray-600">{application.statusReason}</p>
            </div>
          )}

            <Button onClick={() => navigate(`/employee/interviews/schedule/${application.id}`)}>
            Schedule Interview
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.location.href = `mailto:${application.candidateEmail}`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          {application.resumeFilePath && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open(application.resumeFilePath, '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate(`/employee/jobs/${application.jobPositionId}`)}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            View Job Details
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
);
};

  export default ApplicationDetails;
