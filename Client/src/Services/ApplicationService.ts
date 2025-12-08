import axios from 'axios';
import type { Application, UpdateApplicationStatusDto, ApplicationStatistics } from '@/Types/application.types';

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

export const applicationService = {
  getApplicationById: async (id: string): Promise<Application> => {
    const response = await api.get(`/Application/${id}`);
    return response.data;
  },

  getAllApplications: async (): Promise<Application[]> => {
    const response = await api.get('/Application/all');
    return response.data;
  },

  getMyApplications: async (): Promise<Application[]> => {
  const response = await api.get('/Application/my-applications');
  return response.data;
},


  getApplicationsByJob: async (jobPositionId: string): Promise<Application[]> => {
    const response = await api.get(`/Application/job/${jobPositionId}`);
    return response.data;
  },

  updateApplicationStatus: async (data: UpdateApplicationStatusDto): Promise<{ message: string }> => {
    const response = await api.put('/Application/update-status', data);
    return response.data;
  },

  getApplicationStatistics: async (jobPositionId?: string): Promise<ApplicationStatistics> => {
    const url = jobPositionId
      ? `/Application/statistics?jobPositionId=${jobPositionId}`
      : '/Application/statistics';
    const response = await api.get(url);
    return response.data;
  },
};
