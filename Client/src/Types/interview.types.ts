export interface InterviewRound {
  id: string;
  applicationId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  roundNumber: number;
  roundType: string;
  roundName?: string;
  scheduledDate?: string;
  duration?: number;
  meetingLink?: string;
  location?: string;
  statusId: number;
  statusName?: string;
  createdAt: string;
  participants: InterviewParticipant[];
  feedbacks: InterviewFeedback[];
  averageRating?: number;
  totalFeedbacksReceived: number;
  totalParticipants: number;
}

export interface InterviewParticipant {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  participantType: string;
  attendanceStatusId: number;
  attendanceStatusName?: string;
  hasSubmittedFeedback: boolean;
}

export interface InterviewFeedback {
  id: string;
  interviewerId: string;
  interviewerName?: string;
  overallRating?: number;
  technicalRating?: number;
  communicationRating?: number;
  comments?: string;
  recommendation?: string;
  submittedAt: string;
}

export interface CreateInterviewRoundDto {
  applicationId: string;
  roundNumber: number;
  roundType: string;
  roundName?: string;
  scheduledDate?: string;
  duration?: number;
  meetingLink?: string;
  location?: string;
  statusId: number;
  participants?: InterviewParticipantDto[];
}

export interface InterviewParticipantDto {
  userId: string;
  participantType: string;
  attendanceStatusId: number;
}

export interface UpdateInterviewRoundDto {
  id: string;
  scheduledDate?: string;
  duration?: number;
  meetingLink?: string;
  location?: string;
  statusId: number;
}

export interface CreateInterviewFeedbackDto {
  interviewRoundId: string;
  overallRating?: number;
  technicalRating?: number;
  communicationRating?: number;
  comments?: string;
  recommendation?: string;
}

export interface UpdateInterviewFeedbackDto {
  id: string;
  overallRating?: number;
  technicalRating?: number;
  communicationRating?: number;
  comments?: string;
  recommendation?: string;
}

export interface InterviewStatistics {
  totalInterviews: number;
  scheduledInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  pendingFeedbacks: number;
  averageRating: number;
  interviewsByType?: Record<string, number>;
}

export interface InterviewerSchedule {
  interviewRoundId: string;
  applicationId: string;
  candidateName?: string;
  jobTitle?: string;
  roundNumber: number;
  roundType?: string;
  scheduledDate?: string;
  duration?: number;
  meetingLink?: string;
  location?: string;
  participantType?: string;
  hasSubmittedFeedback: boolean;
}

export const InterviewStatus = {
  SCHEDULED: 9,
  COMPLETED: 10,
  CANCELLED: 11
} as const;

export const AttendanceStatus = {
  PRESENT: 12,
  ABSENT: 13,
  PENDING: 14
} as const;

export const RoundTypes = {
  TECHNICAL: 'Technical',
  HR: 'HR',
  PANEL: 'Panel',
  MANAGERIAL: 'Managerial'
} as const;

export const ParticipantTypes = {
  PRIMARY: 'Primary_Interviewer',
  CO: 'Co_Interviewer'
} as const;
