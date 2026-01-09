import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobPositionService } from '@/Services/JobPositionService';
import { skillService, type Skill } from '@/Services/SkillService';
import type { JobPosition, UpdateJobPositionDto } from '@/Types/job.types';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, AlertCircle } from 'lucide-react';

interface SkillRequirement {
  skillId: number;
  skillName: string;
  minYearsExperience: number;
}

const EditJobPosition = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
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

  const [requiredSkills, setRequiredSkills] = useState<SkillRequirement[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<SkillRequirement[]>([]);

  useEffect(() => {
    fetchSkills();
    if (id) {
      fetchJobPosition();
    }
  }, [id]);

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const skills = await skillService.getAllSkills();
      setAvailableSkills(skills.filter(skill => skill.isActive));
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoadingSkills(false);
    }
  };

  const fetchJobPosition = async () => {
    try {
      setFetching(true);
      const job: JobPosition = await jobPositionService.getJobPositionById(id!);

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
          minYearsExperience: skill.minYearsExperience || 0
        })) || [],
        preferredSkills: job.preferredSkills?.map(skill => ({
          skillId: skill.skillId,
          minYearsExperience: skill.minYearsExperience || 0
        })) || [],
      });

      setRequiredSkills(
        job.requiredSkills?.map(skill => ({
          skillId: skill.skillId,
          skillName: skill.skillName,
          minYearsExperience: skill.minYearsExperience || 0
        })) || []
      );

      setPreferredSkills(
        job.preferredSkills?.map(skill => ({
          skillId: skill.skillId,
          skillName: skill.skillName,
          minYearsExperience: skill.minYearsExperience || 0
        })) || []
      );
    } catch (error: any) {
      toast.error('Failed to fetch job position');
      navigate('/employee/jobs');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (requiredSkills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    const hasEmptyRequiredSkill = requiredSkills.some(skill => !skill.skillId);
    if (hasEmptyRequiredSkill) {
      toast.error('Please select a skill for all required skill entries');
      return;
    }

    const hasEmptyPreferredSkill = preferredSkills.some(skill => !skill.skillId);
    if (hasEmptyPreferredSkill) {
      toast.error('Please select a skill for all preferred skill entries');
      return;
    }

    setLoading(true);

    try {
      const submitData: UpdateJobPositionDto = {
        ...formData,
        requiredSkills: requiredSkills.map(({ skillId, minYearsExperience }) => ({
          skillId,
          minYearsExperience,
        })),
        preferredSkills: preferredSkills.map(({ skillId, minYearsExperience }) => ({
          skillId,
          minYearsExperience,
        })),
      };

      await jobPositionService.updateJobPosition(id!, submitData);
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

  const addSkill = (type: 'required' | 'preferred') => {
    const newSkill: SkillRequirement = {
      skillId: 0,
      skillName: '',
      minYearsExperience: 0,
    };

    if (type === 'required') {
      setRequiredSkills(prev => [...prev, newSkill]);
    } else {
      setPreferredSkills(prev => [...prev, newSkill]);
    }
  };

  const removeSkill = (type: 'required' | 'preferred', index: number) => {
    if (type === 'required') {
      setRequiredSkills(prev => prev.filter((_, i) => i !== index));
    } else {
      setPreferredSkills(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSkill = (
    type: 'required' | 'preferred',
    index: number,
    field: keyof SkillRequirement,
    value: any
  ) => {
    const updateArray = type === 'required' ? requiredSkills : preferredSkills;
    const setArray = type === 'required' ? setRequiredSkills : setPreferredSkills;

    const updated = [...updateArray];

    if (field === 'skillId') {
      const skill = availableSkills.find(s => s.id === Number(value));
      updated[index] = {
        ...updated[index],
        skillId: Number(value),
        skillName: skill?.skillName || '',
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }

    setArray(updated);
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

            <div className="space-y-2">
              <Label htmlFor="statusReason">Status Reason</Label>
              <Input
                id="statusReason"
                value={formData.statusReason || ''}
                onChange={(e) => handleChange('statusReason', e.target.value)}
                placeholder="Optional: Reason for current status"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Required Skills *
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">At least one required skill must be added</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill('required')}
                disabled={loadingSkills}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSkills ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading skills...</p>
              </div>
            ) : requiredSkills.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">No required skills added</p>
                <p className="text-gray-500 text-sm mt-1">Click "Add Skill" to add at least one required skill</p>
              </div>
            ) : (
              requiredSkills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Skill *</Label>
                      <Select
                        value={skill.skillId ? skill.skillId.toString() : ''}
                        onValueChange={(value) => updateSkill('required', index, 'skillId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.skillName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min. Years Experience</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={skill.minYearsExperience}
                        onChange={(e) =>
                          updateSkill('required', index, 'minYearsExperience', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill('required', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preferred Skills</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Optional: Add skills that are nice to have</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill('preferred')}
                disabled={loadingSkills}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingSkills ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading skills...</p>
              </div>
            ) : preferredSkills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No preferred skills added. These are optional.
              </div>
            ) : (
              preferredSkills.map((skill, index) => (
                <div key={index} className="flex gap-4 items-end p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Skill *</Label>
                      <Select
                        value={skill.skillId ? skill.skillId.toString() : ''}
                        onValueChange={(value) => updateSkill('preferred', index, 'skillId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSkills.map((s) => (
                            <SelectItem key={s.id} value={s.id.toString()}>
                              {s.skillName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Min. Years Experience</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={skill.minYearsExperience}
                        onChange={(e) =>
                          updateSkill('preferred', index, 'minYearsExperience', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill('preferred', index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-6">
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
      </form>
    </div>
  );
};

export default EditJobPosition;