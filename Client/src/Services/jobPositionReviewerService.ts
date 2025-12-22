import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';


// Create axios instance with default config
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

export interface AssignReviewerDto {
  jobPositionId: string;
  reviewerId: string;
}

export interface BulkAssignReviewersDto {
  jobPositionId: string;
  reviewerIds: string[];
}

export interface JobPositionReviewerResponseDto {
  id: string;
  jobPositionId: string;
  jobTitle?: string;
  reviewerId: string;
  reviewerName?: string;
  reviewerEmail?: string;
  assignedAt: string;
  assignedByName?: string;
  isActive: boolean;
}

const jobPositionReviewerService = {
  // Assign reviewer to job position
  assignReviewer: async (data: AssignReviewerDto) => {
    const response = await apiClient.post('/JobPositionReviewer/assign', data);
    return response.data;
  },

  // Bulk assign reviewers
  bulkAssignReviewers: async (data: BulkAssignReviewersDto) => {
    const response = await apiClient.post('/JobPositionReviewer/bulk-assign', data);
    return response.data;
  },

  // Remove reviewer from job position
  removeReviewer: async (id: string) => {
    const response = await apiClient.delete(`/JobPositionReviewer/remove/${id}`);
    return response.data;
  },

  // Get reviewers for job position
  getReviewersForJob: async (jobPositionId: string): Promise<JobPositionReviewerResponseDto[]> => {
    const response = await apiClient.get(`/JobPositionReviewer/job/${jobPositionId}`);
    return response.data;
  },

  // Get my assigned job positions
  getMyAssignedJobs: async (): Promise<JobPositionReviewerResponseDto[]> => {
    const response = await apiClient.get('/JobPositionReviewer/my-assignments');
    return response.data;
  },
};

export default jobPositionReviewerService;