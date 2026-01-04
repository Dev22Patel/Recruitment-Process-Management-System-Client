import { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/Button';
import { User, Edit, MapPin, Building, Calendar, GraduationCap, DollarSign, Clock} from 'lucide-react';
import { useAuth } from '../../Context/AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../utils/constants';
import {
  PersonalInfoSection,
  ProfessionalInfoSection,
  EducationInfoSection,
  AdditionalInfoSection,
  SkillsSection,
  MissingFieldsAlert
} from './ProfileFormSections';
import type { ProfileProps, CandidateProfile, UpdateCandidate, Skill, CandidateSkillResponse, RequiredField } from './ProfileTypes';

export const Profile = ({
  isProfileComplete,
  checkProfileCompletion
}: ProfileProps) => {
  const { user } = useAuth();
  const [candidateData, setCandidateData] = useState<CandidateProfile | null>(null);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateCandidate>({});
  const [skillCategories, setSkillCategories] = useState<string[]>([]);

  // Fetch candidate profile
  const fetchCandidateProfile = async () => {
    if (!user?.userId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Candidate/${user.userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCandidateData(data);
        console.log('Fetched candidate data:', data);
        setFormData({
          currentLocation: data.currentLocation || '',
          totalExperience: data.totalExperience || 0,
          currentCompany: data.currentCompany || '',
          currentSalary: data.currentSalary || 0,
          expectedSalary: data.expectedSalary || 0,
          noticePeriod: data.noticePeriod || 0,
          collegeName: data.collegeName || '',
          graduationYear: data.graduationYear || new Date().getFullYear(),
          degree: data.degree || '',
          resumeFilePath: data.resumeFilePath || '',
          skills: data.skills?.map((skill: CandidateSkillResponse) => ({
            skillId: skill.skillId,
            yearsOfExperience: skill.yearsOfExperience
          })) || []
        });
      } else if (response.status === 404) {
        setCandidateData(null);
        setFormData({
          totalExperience: 0,
          currentSalary: 0,
          expectedSalary: 0,
          noticePeriod: 0,
          graduationYear: new Date().getFullYear(),
          skills: []
        });
      }
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      toast.error('Failed to load profile data.');
    }
  };

  // Fetch available skills
  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Skill`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const skills = await response.json();
        setAvailableSkills(skills);
        console.log('Fetched skills:', skills);
        const categories = [...new Set(skills.map((skill: Skill) => skill.category).filter(Boolean))];
        setSkillCategories(categories as string[]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills data.');
    }
  };

  useEffect(() => {
    fetchCandidateProfile();
    fetchSkills();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Sanitize data to ensure proper integer types
      const sanitizedData = {
        ...formData,
        currentSalary: formData.currentSalary ? parseInt(String(formData.currentSalary)) : 0,
        expectedSalary: formData.expectedSalary ? parseInt(String(formData.expectedSalary)) : 0,
        totalExperience: formData.totalExperience ? parseFloat(String(formData.totalExperience)) : 0,
        noticePeriod: formData.noticePeriod ? parseInt(String(formData.noticePeriod)) : 0,
        graduationYear: formData.graduationYear ? parseInt(String(formData.graduationYear)) : new Date().getFullYear()
      };
      
      console.log('Sending sanitized data:', sanitizedData);
      
      const response = await fetch(`${API_BASE_URL}/Candidate/${user.userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        console.log('Received updated data:', updatedData);
        setCandidateData(updatedData.data || updatedData);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
        checkProfileCompletion();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillId: string) => {
    const updatedSkills = formData.skills?.filter(skill => skill.skillId !== skillId) || [];
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
  };

  // Get skill name by ID
  const getSkillName = (skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId);
    return skill?.skillName || 'Unknown Skill';
  };

  // Get skill category by ID
  const getSkillCategory = (skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId);
    return skill?.category || '';
  };

  // Check which required fields are missing
  const getMissingFields = (): RequiredField[] => {
    const isFresher = !formData.totalExperience || formData.totalExperience === 0;
    
    // Fields required for ALL candidates
    const requiredForAll = [
      { key: 'currentLocation', label: 'Current Location' },
      { key: 'expectedSalary', label: 'Expected Salary' },
      { key: 'collegeName', label: 'College Name' },
      { key: 'graduationYear', label: 'Graduation Year' },
      { key: 'degree', label: 'Degree' }
    ];
    
    // Fields required ONLY for experienced candidates
    const requiredForExperienced = [
      { key: 'totalExperience', label: 'Total Experience' },
      { key: 'currentCompany', label: 'Current Company' },
      { key: 'currentSalary', label: 'Current Salary' },
      { key: 'noticePeriod', label: 'Notice Period' }
    ];
    
    // Combine based on fresher status
    const allRequired = isFresher 
      ? requiredForAll 
      : [...requiredForAll, ...requiredForExperienced];
    
    // Filter out filled fields
    return allRequired.filter(field => {
      const value = formData[field.key as keyof UpdateCandidate];
      return !value || 
             (typeof value === 'string' && value.trim() === '') ||
             (typeof value === 'number' && value <= 0);
    });
  };

  // Group candidate skills by category
  const getSkillsByCategory = () => {
    const skillsByCategory: { [key: string]: CandidateSkillResponse[] } = {};
    candidateData?.skills?.forEach(skill => {
      const category = skill.category || 'Other';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });
    return skillsByCategory;
  };

  // Reset form data to original candidate data
  const resetFormData = () => {
    if (candidateData) {
      setFormData({
        currentLocation: candidateData.currentLocation || '',
        totalExperience: candidateData.totalExperience || 0,
        currentCompany: candidateData.currentCompany || '',
        currentSalary: candidateData.currentSalary || 0,
        expectedSalary: candidateData.expectedSalary || 0,
        noticePeriod: candidateData.noticePeriod || 0,
        collegeName: candidateData.collegeName || '',
        graduationYear: candidateData.graduationYear || new Date().getFullYear(),
        degree: candidateData.degree || '',
        resumeFilePath: candidateData.resumeFilePath || '',
        skills: candidateData.skills?.map((skill: CandidateSkillResponse) => ({
          skillId: skill.skillId,
          yearsOfExperience: skill.yearsOfExperience
        })) || []
      });
    }
  };

  // Show profile completion form if profile is incomplete
  if (!isProfileComplete) {
    const missingFields = getMissingFields();
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {candidateData ? 'Complete Your Profile' : 'Create Your Profile'}
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <MissingFieldsAlert missingFields={missingFields} candidateData={candidateData} />
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoSection formData={formData} setFormData={setFormData} isRequired />
            <ProfessionalInfoSection formData={formData} setFormData={setFormData} isRequired />
            <EducationInfoSection formData={formData} setFormData={setFormData} isRequired />
            <AdditionalInfoSection formData={formData} setFormData={setFormData} />
            <SkillsSection
              formData={formData}
              setFormData={setFormData}
              availableSkills={availableSkills}
              skillCategories={skillCategories}
              isEditing={false}
              onRemoveSkill={handleRemoveSkill}
              getSkillName={getSkillName}
              getSkillCategory={getSkillCategory}
            />
            <div className="flex space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Saving...' : candidateData ? 'Update Profile' : 'Save Profile'}
              </Button>
              <Button type="button" variant="outline" onClick={checkProfileCompletion}>
                Refresh Status
              </Button>
              {candidateData && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetFormData();
                    toast.info('Form reset to saved data.');
                  }}
                >
                  Reset to Saved
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show completed profile (view/edit mode)
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                resetFormData(); // Reset form when entering edit mode
              }
            }}
            variant="outline"
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoSection formData={formData} setFormData={setFormData} />
            <ProfessionalInfoSection formData={formData} setFormData={setFormData} />
            <EducationInfoSection formData={formData} setFormData={setFormData} />
            <AdditionalInfoSection formData={formData} setFormData={setFormData} />
            <SkillsSection
              formData={formData}
              setFormData={setFormData}
              availableSkills={availableSkills}
              skillCategories={skillCategories}
              isEditing={true}
              onRemoveSkill={handleRemoveSkill}
              getSkillName={getSkillName}
              getSkillCategory={getSkillCategory}
            />
            <div className="flex space-x-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  resetFormData();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          // View mode
          <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{candidateData?.userName || user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{candidateData?.currentLocation || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Experience</p>
                      <p className="font-medium">{candidateData?.totalExperience || 0} years</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Current Company</p>
                      <p className="font-medium">{candidateData?.currentCompany || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Current Salary</p>
                      <p className="font-medium">₹{candidateData?.currentSalary?.toLocaleString() || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Expected Salary</p>
                      <p className="font-medium">₹{candidateData?.expectedSalary?.toLocaleString() || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Professional Information
              </h3>
              
              {/* Check if fresher */}
              {!candidateData?.totalExperience || candidateData.totalExperience === 0 ? (
                // Fresher Display
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 text-white rounded-full p-2">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-blue-900 font-semibold">Fresher Candidate</p>
                      <p className="text-sm text-blue-700">Looking for first opportunity</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-xs text-blue-600">Expected Salary</p>
                        <p className="font-medium text-blue-900">
                          ₹{candidateData?.expectedSalary?.toLocaleString() || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Experienced Candidate Display
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Total Experience</p>
                          <p className="font-medium">{candidateData?.totalExperience} years</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Current Company</p>
                          <p className="font-medium">{candidateData?.currentCompany || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Current Salary</p>
                          <p className="font-medium">
                            ₹{candidateData?.currentSalary?.toLocaleString() || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Notice Period</p>
                          <p className="font-medium">{candidateData?.noticePeriod || 0} days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expected Salary - Always shown for experienced */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Expected Salary</p>
                        <p className="font-medium text-lg text-green-600">
                          ₹{candidateData?.expectedSalary?.toLocaleString() || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Education Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Education Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="font-medium">{candidateData?.collegeName || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Degree</p>
                    <p className="font-medium">{candidateData?.degree || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Graduation Year</p>
                    <p className="font-medium">{candidateData?.graduationYear || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills by Category */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Skills</h3>
              {(() => {
                const skillsByCategory = getSkillsByCategory();
                const hasSkills = Object.keys(skillsByCategory).length > 0;
                if (!hasSkills) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-sm">No skills added yet.</div>
                    </div>
                  );
                }
                return (
                  <div className="space-y-6">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className="text-md font-medium text-gray-700 mb-3">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {skills.map((skill, index) => (
                            <div key={index} className="border border-gray-200 p-3 rounded-lg hover:bg-gray-50">
                              <div className="font-medium text-gray-900">{skill.skillName}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                {skill.yearsOfExperience} years experience
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                                  style={{
                                    width: `${Math.min((skill.yearsOfExperience / 10) * 100, 100)}%`
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Resume Display */}
            {candidateData?.resumeFilePath && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Resume</h3>
                <div className="flex flex-col items-center space-y-4">
                  <a
                    href={candidateData.resumeFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline text-sm"
                  >
                    Open Resume in New Tab
                  </a>
                  <iframe
                    src={candidateData.resumeFilePath}
                    className="w-full max-w-4xl h-[800px] border border-gray-300 rounded-lg shadow-md"
                    title="Resume Preview"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};