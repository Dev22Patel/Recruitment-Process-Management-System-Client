import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobPositionService } from '@/Services/JobPositionService';
import type { JobPosition, UpdateJobPositionDto } from '@/Types/job.types';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const EditJobPosition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<UpdateJobPositionDto>({
    id: '',
    title: '',
    description: '',
    department: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid-level',
    minExperience: 0,
    salary: undefined,
    statusId: 1,
    statusReason: '',
    requiredSkills: [],
    preferredSkills: [],
  });

  useEffect(() => {
    if (id) {
      fetchJobPosition();
    }
  }, [id]);

  const fetchJobPosition = async () => {
    try {
      setFetching(true);
      const job: JobPosition = await jobPositionService.getJobPositionById(id!);

      // Map JobPosition to UpdateJobPositionDto
      setFormData({
        id: job.id,
        title: job.title,
        description: job.description,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel,
        minExperience: job.minExperience || 0,
        salary: job.salary,
        statusId: job.statusId,
        statusReason: job.statusReason || '',
        requiredSkills: job.requiredSkills?.map(skill => ({
          skillId: skill.skillId,
          minYearsExperience: skill.minYearsExperience
        })) || [],
        preferredSkills: job.preferredSkills?.map(skill => ({
          skillId: skill.skillId,
          minYearsExperience: skill.minYearsExperience
        })) || [],
      });
    } catch (error: any) {
      toast.error('Failed to fetch job position');
      navigate('/employee/jobs');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await jobPositionService.updateJobPosition(id!, formData);
      toast.success('Job position updated successfully');
      navigate(`/employee/jobs/${id}`);
    } catch (error: any) {
      toast.error('Failed to update job position');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateJobPositionDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/employee/jobs/${id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job Position</h1>
          <p className="text-gray-600 mt-1">Update job opening details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  required
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g., Engineering"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Bangalore, India"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleChange('employmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Experience Level *</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleChange('experienceLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="minExperience">Minimum Experience (years)</Label>
                <Input
                  id="minExperience"
                  type="number"
                  min="0"
                  value={formData.minExperience || ''}
                  onChange={(e) => handleChange('minExperience', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary (Annual)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  value={formData.salary || ''}
                  onChange={(e) => handleChange('salary', parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., 1200000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.statusId?.toString()}
                  onValueChange={(value) => handleChange('statusId', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active/Open</SelectItem>
                    <SelectItem value="2">On Hold</SelectItem>
                    <SelectItem value="3">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={(e: any) => handleChange('description', e.target.value)}
                placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
              />
            </div>

            {/* Status Reason */}
            <div className="space-y-2">
              <Label htmlFor="statusReason">Status Reason</Label>
              <Input
                id="statusReason"
                value={formData.statusReason || ''}
                onChange={(e) => handleChange('statusReason', e.target.value)}
                placeholder="Optional: Reason for current status"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating...' : 'Update Job Position'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/employee/jobs/${id}`)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditJobPosition;
