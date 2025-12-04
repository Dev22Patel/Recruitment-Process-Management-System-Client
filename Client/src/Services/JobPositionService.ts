import axios from 'axios';
import type { CreateJobPositionDto, JobPosition, UpdateJobPositionDto, JobListing } from '@/Types/job.types';

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

export const jobPositionService = {
  createJobPosition: async (data: CreateJobPositionDto): Promise<JobPosition> => {
    const response = await api.post('/JobPositions', data);
    return response.data;
  },

  getJobPositionById: async (id: string): Promise<JobPosition> => {
    const response = await api.get(`/JobPositions/${id}`);
    return response.data;
  },

  getAllJobPositions: async (): Promise<JobPosition[]> => {
    const response = await api.get('/JobPositions');
    return response.data;
  },

  getActiveJobListings: async (): Promise<JobListing[]> => {
    const response = await api.get('/JobPositions/active');
    return response.data;
  },

 async updateJobPosition(id: string, dto: UpdateJobPositionDto): Promise<JobPosition> {
  const response = await api.put(`/JobPositions/${id}`, dto);
  return response.data;
},

  deleteJobPosition: async (id: string): Promise<void> => {
    await api.delete(`/JobPositions/${id}`);
  },
};
