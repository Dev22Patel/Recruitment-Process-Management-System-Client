import axios from 'axios';
import type {
  InterviewRound,
  CreateInterviewRoundDto,
  UpdateInterviewRoundDto,
  CreateInterviewFeedbackDto,
  UpdateInterviewFeedbackDto,
  InterviewStatistics,
  InterviewerSchedule,
  InterviewFeedback,
  InterviewParticipantDto
} from '@/Types/interview.types';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const interviewService = {
  // Interview Round APIs
  scheduleInterview: async (data: CreateInterviewRoundDto): Promise<{ message: string; interviewRound: InterviewRound }> => {
    const response = await api.post('/Interview/schedule', data);
    return response.data;
  },

  getInterviewById: async (id: string): Promise<InterviewRound> => {
    const response = await api.get(`/Interview/${id}`);
    return response.data;
  },

  getAllInterviews: async (): Promise<InterviewRound[]> => {
    const response = await api.get('/Interview/all');
    return response.data;
  },

  getInterviewsByApplication: async (applicationId: string): Promise<InterviewRound[]> => {
    const response = await api.get(`/Interview/application/${applicationId}`);
    return response.data;
  },

  getMySchedule: async (): Promise<InterviewerSchedule[]> => {
    const response = await api.get('/Interview/my-schedule');
    return response.data;
  },

  updateInterview: async (data: UpdateInterviewRoundDto): Promise<{ message: string }> => {
    const response = await api.put('/Interview/update', data);
    return response.data;
  },

  addParticipant: async (interviewRoundId: string, data: InterviewParticipantDto): Promise<{ message: string }> => {
    const response = await api.post(`/Interview/${interviewRoundId}/add-participant`, data);
    return response.data;
  },

  deleteInterview: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/Interview/${id}`);
    return response.data;
  },

  // Feedback APIs
  submitFeedback: async (data: CreateInterviewFeedbackDto): Promise<{ message: string; feedbackId: string }> => {
    const response = await api.post('/Interview/submit-feedback', data);
    return response.data;
  },

  updateFeedback: async (data: UpdateInterviewFeedbackDto): Promise<{ message: string }> => {
    const response = await api.put('/Interview/update-feedback', data);
    return response.data;
  },

  getFeedbacksByInterview: async (interviewRoundId: string): Promise<InterviewFeedback[]> => {
    const response = await api.get(`/Interview/${interviewRoundId}/feedbacks`);
    return response.data;
  },

  // Statistics
  getStatistics: async (): Promise<InterviewStatistics> => {
    const response = await api.get('/Interview/statistics');
    return response.data;
  },
};
