// src/Pages/Profile/types.ts
export interface ProfileProps {
  isProfileComplete: boolean;
  setIsProfileComplete: (complete: boolean) => void;
  setActiveTab: (tab: string) => void;
  checkProfileCompletion: () => void;
}

export interface CandidateProfile {
  id?: string;
  userId?: string;
  currentLocation?: string;
  totalExperience?: number;
  currentCompany?: string;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  source?: string;
  collegeName?: string;
  graduationYear?: number;
  degree?: string;
  resumeFilePath?: string;
  isProfileCompleted?: boolean;
  createdAt?: string;
  userName?: string;
  email?: string;
  skills?: CandidateSkillResponse[];
}

export interface CandidateSkillResponse {
  skillId: string;
  skillName: string;
  category: string;
  yearsOfExperience: number;
}

export interface CandidateSkill {
  skillId: string;
  yearsOfExperience: number;
}

export interface UpdateCandidate {
  currentLocation?: string;
  totalExperience?: number;
  currentCompany?: string;
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  source?: string;
  collegeName?: string;
  graduationYear?: number;
  degree?: string;
  resumeFilePath?: string;
  skills?: CandidateSkill[];
}

export interface Skill {
  id: string;
  skillName: string;
  category?: string;
  description?: string;
}

export interface RequiredField {
  key: string;
  label: string;
}
