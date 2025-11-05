export interface Application {
  id: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobPositionId: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  applicationDate: string;
  statusId: number;
  statusName?: string;
  statusReason?: string;
  createdAt: string;
  totalExperience?: number;
  expectedSalary?: number;
  noticePeriod?: number;
  resumeFilePath?: string;
  candidateSkills: string[];
  requiredSkills: string[];
  matchingSkillsCount: number;
}

export interface UpdateApplicationStatusDto {
  applicationId: string;
  statusId: number;
  statusReason?: string;
}

export interface ApplicationStatistics {
  totalApplications: number;
  pendingApplications: number;
  inScreeningApplications: number;
  inInterviewApplications: number;
  selectedApplications: number;
  rejectedApplications: number;
}

export const ApplicationStatus = {
  APPLIED: 4,
  SCREENING: 5,
  INTERVIEW: 6,
  SELECTED: 7,
  REJECTED: 8
} as const;

export const ApplicationStatusNames = {
  4: 'Applied',
  5: 'Screening',
  6: 'Interview',
  7: 'Selected',
  8: 'Rejected'
} as const;
