export interface SkillRequirement {
  skillId: number;
  skillName: string;
  category?: string;
  minYearsExperience?: number;
}

export interface CreateSkillRequirementDto {
  skillId: number;
  minYearsExperience?: number;
}

export interface JobPosition {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  minExperience?: number;
  salary?: number;
  statusId: number;
  statusName?: string;
  statusReason?: string;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  requiredSkills: SkillRequirement[];
  preferredSkills: SkillRequirement[];
}

export interface CreateJobPositionDto {
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  minExperience?: number;
  salary?: number;
  statusId: number;
  statusReason?: string;
  requiredSkills?: CreateSkillRequirementDto[];
  preferredSkills?: CreateSkillRequirementDto[];
}

export interface UpdateJobPositionDto {
  id: string;
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  minExperience?: number;
  salary?: number;
  statusId?: number;
  statusReason?: string;
  requiredSkills?: CreateSkillRequirementDto[];
  preferredSkills?: CreateSkillRequirementDto[];
}

export interface JobListing {
  id: string;
  title: string;
  description: string;
  department: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  experienceRange: string;
  salary?: number;
  postedDate: string;
  requiredSkills: string[];
  preferredSkills: string[];
}
