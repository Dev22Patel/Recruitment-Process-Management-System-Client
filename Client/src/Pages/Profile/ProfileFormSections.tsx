// src/Pages/Profile/ProfileFormSections.tsx
import { Button } from '@/Components/ui/Button';
import { Plus, X, MapPin, Clock, Building, DollarSign, Calendar, GraduationCap, Upload } from 'lucide-react';
import type { UpdateCandidate, CandidateSkill, Skill, RequiredField } from './ProfileTypes';
import { useState, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from 'react';

interface PersonalInfoSectionProps {
  formData: UpdateCandidate;
  setFormData: React.Dispatch<React.SetStateAction<UpdateCandidate>>;
  isRequired?: boolean;
}

export const PersonalInfoSection = ({ formData, setFormData, isRequired = false }: PersonalInfoSectionProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Current Location {isRequired && '*'}
        </label>
        <input
          type="text"
          required={isRequired}
          value={formData.currentLocation || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, currentLocation: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Mumbai, Maharashtra"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline h-4 w-4 mr-1" />
          Total Experience (Years) {isRequired && '*'}
        </label>
        <input
          type="number"
          required={isRequired}
          min="0"
          max="50"
          step="0.1"
          value={formData.totalExperience || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, totalExperience: parseFloat(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

interface ProfessionalInfoSectionProps {
  formData: UpdateCandidate;
  setFormData: React.Dispatch<React.SetStateAction<UpdateCandidate>>;
  isRequired?: boolean;
}

export const ProfessionalInfoSection = ({ formData, setFormData, isRequired = false }: ProfessionalInfoSectionProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Professional Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Building className="inline h-4 w-4 mr-1" />
          Current Company {isRequired && '*'}
        </label>
        <input
          type="text"
          required={isRequired}
          value={formData.currentCompany || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, currentCompany: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Current Salary (₹) {isRequired && '*'}
        </label>
        <input
          type="number"
          required={isRequired}
          min="0"
          value={formData.currentSalary || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, currentSalary: parseFloat(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline h-4 w-4 mr-1" />
          Expected Salary (₹) {isRequired && '*'}
        </label>
        <input
          type="number"
          required={isRequired}
          min="0"
          value={formData.expectedSalary || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedSalary: parseFloat(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Notice Period (Days) {isRequired && '*'}
        </label>
        <input
          type="number"
          required={isRequired}
          min="0"
          max="365"
          value={formData.noticePeriod || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, noticePeriod: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

interface EducationInfoSectionProps {
  formData: UpdateCandidate;
  setFormData: React.Dispatch<React.SetStateAction<UpdateCandidate>>;
  isRequired?: boolean;
}

export const EducationInfoSection = ({ formData, setFormData, isRequired = false }: EducationInfoSectionProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Education Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <GraduationCap className="inline h-4 w-4 mr-1" />
          College Name {isRequired && '*'}
        </label>
        <input
          type="text"
          required={isRequired}
          value={formData.collegeName || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Degree {isRequired && '*'}
        </label>
        <input
          type="text"
          required={isRequired}
          value={formData.degree || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., B.Tech Computer Science"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Graduation Year {isRequired && '*'}
        </label>
        <input
          type="number"
          required={isRequired}
          min="1900"
          max="2027"
          value={formData.graduationYear || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, graduationYear: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  </div>
);

interface AdditionalInfoSectionProps {
  formData: UpdateCandidate;
  setFormData: React.Dispatch<React.SetStateAction<UpdateCandidate>>;
}

export const AdditionalInfoSection = ({ formData, setFormData }: AdditionalInfoSectionProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Additional Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Upload className="inline h-4 w-4 mr-1" />
          Resume File Path
        </label>
        <input
          type="text"
          value={formData.resumeFilePath || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, resumeFilePath: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Path to your resume file"
        />
      </div>
    </div>
  </div>
);

interface SkillsSectionProps {
  formData: UpdateCandidate;
  setFormData: React.Dispatch<React.SetStateAction<UpdateCandidate>>;
  availableSkills: Skill[];
  skillCategories: string[];
  isEditing: boolean;
  onRemoveSkill: (skillId: string) => void;
  getSkillName: (skillId: string) => string;
  getSkillCategory: (skillId: string) => string;
}

export const SkillsSection = ({
  formData,
  setFormData,
  availableSkills,
  skillCategories,
  isEditing,
  onRemoveSkill,
  getSkillName,
  getSkillCategory
}: SkillsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillExperience, setSkillExperience] = useState('');

  const getFilteredSkills = () => {
    if (!selectedCategory) return availableSkills;
    return availableSkills.filter(skill => skill.category === selectedCategory);
  };

  const handleAddSkill = () => {
    if (!selectedSkill || !skillExperience || parseFloat(skillExperience) < 0) {
      return;
    }

    const skillToAdd = {
      skillId: selectedSkill,
      yearsOfExperience: parseFloat(skillExperience),
    };

    const updatedSkills = [...(formData.skills || []), skillToAdd];
    setFormData(prev => ({ ...prev, skills: updatedSkills }));

    // Reset form
    setShowAddForm(false);
    setSelectedCategory('');
    setSelectedSkill('');
    setSkillExperience('');
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setSelectedCategory('');
    setSelectedSkill('');
    setSkillExperience('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
        {!showAddForm && (
          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Skill
          </Button>
        )}
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Add New Skill</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSkill('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose skill...</option>
                {getFilteredSkills()
                  .filter(skill => !formData.skills?.some(cs => cs.skillId === skill.id))
                  .map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skillName}
                    </option>
                  ))
                }
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={skillExperience}
                onChange={(e) => setSkillExperience(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2.5"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button
                type="button"
                size="sm"
                onClick={handleAddSkill}
                disabled={!selectedSkill || !skillExperience}
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={cancelAdd}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-3">
        {formData.skills?.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{getSkillName(skill.skillId)}</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {getSkillCategory(skill.skillId)}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {skill.yearsOfExperience} years experience
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={skill.yearsOfExperience || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const updatedSkills = formData.skills?.map((s, i) =>
                        i === index ? { ...s, yearsOfExperience: value ? parseFloat(value) : 0 } : s
                      ) || [];
                      setFormData(prev => ({ ...prev, skills: updatedSkills }));
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">years</span>
                </div>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onRemoveSkill(skill.skillId)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {(!formData.skills || formData.skills.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-sm">No skills added yet.</div>
            <div className="text-xs mt-1">Click "Add Skill" to get started.</div>
          </div>
        )}
      </div>
    </div>
  );
};


export const MissingFieldsAlert = ({ missingFields, candidateData }: any) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <p className="text-yellow-800 text-sm">
      <strong>Profile Incomplete:</strong> Please fill in all required fields to access all dashboard features.
      {candidateData && (
        <span className="block mt-1">
          Some information is already saved. Please complete the remaining fields.
        </span>
      )}
    </p>
    {missingFields.length > 0 && (
      <div className="mt-3">
        <p className="text-yellow-800 text-sm font-medium mb-2">Missing required fields:</p>
        <div className="flex flex-wrap gap-2">
          {missingFields.map((field: { key: Key | null | undefined; label: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
            <span key={field.key} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
              {field.label}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);
