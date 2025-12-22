import axios from 'axios';

import { API_BASE_URL } from '../utils/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface CreateScreeningReviewDto {
  applicationId: string;
  rating?: number;
  comments?: string;
  isRecommendedForInterview: boolean;
  verifiedSkills?: SkillVerificationDto[];
}

export interface UpdateScreeningReviewDto {
  screeningReviewId: string;
  rating?: number;
  comments?: string;
  isRecommendedForInterview: boolean;
  verifiedSkills?: SkillVerificationDto[];
}

export interface SkillVerificationDto {
  candidateSkillId: string;
  skillName?: string;
  claimedYears?: number;
  verifiedYears?: number;
  isVerified: boolean;
  comments?: string;
}

export interface ScreeningReviewResponseDto {
  id: string;
  applicationId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  reviewedBy: string;
  reviewerName?: string;
  reviewDate: string;
  statusId: number;
  statusName?: string;
  rating?: number;
  comments?: string;
  isRecommendedForInterview: boolean;
  verifiedSkills?: SkillVerificationDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface PendingScreeningResponseDto {
  applicationId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  applicationDate: string;
  totalExperience?: number;
  currentCompany?: string;
  resumeFilePath?: string;
  matchingSkills: number;
  requiredSkills: number;
  hasBeenScreenedBefore: boolean;
  candidateSkills?: CandidateSkillDto[];
}

export interface CandidateSkillDto {
  candidateSkillId: string;
  skillId: string;
  skillName?: string;
  yearsOfExperience?: number;
  isVerified: boolean;
  isRequired: boolean;
}

export interface ScreeningStatisticsDto {
  totalPendingScreenings: number;
  totalCompletedScreenings: number;
  approvedCount: number;
  rejectedCount: number;
  averageRating: number;
  approvalRate: number;
}

const screeningService = {
  // Create screening review
  createScreeningReview: async (data: CreateScreeningReviewDto) => {
    const response = await apiClient.post('/Screening/create', data);
    return response.data;
  },

  // Update screening review
  updateScreeningReview: async (data: UpdateScreeningReviewDto) => {
    const response = await apiClient.put('/Screening/update', data);
    return response.data;
  },

  // Get screening review by ID
  getScreeningReviewById: async (id: string): Promise<ScreeningReviewResponseDto> => {
    const response = await apiClient.get(`/Screening/${id}`);
    return response.data;
  },

  // Get pending screenings for current reviewer
  getPendingScreenings: async (): Promise<PendingScreeningResponseDto[]> => {
    const response = await apiClient.get('/Screening/pending');
    return response.data;
  },

  // Get screenings by application
  getScreeningsByApplication: async (applicationId: string): Promise<ScreeningReviewResponseDto[]> => {
    const response = await apiClient.get(`/Screening/application/${applicationId}`);
    return response.data;
  },

  // Get screening statistics
  getScreeningStatistics: async (reviewerId?: string): Promise<ScreeningStatisticsDto> => {
    const params = reviewerId ? { reviewerId } : {};
    const response = await apiClient.get('/Screening/statistics', { params });
    return response.data;
  },
};

export default screeningService;