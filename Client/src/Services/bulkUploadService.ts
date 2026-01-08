

import axios, {type AxiosProgressEvent } from 'axios';
import {
  type BulkUploadResponse,
  type BulkUploadStatus,
  type BulkUploadHistoryResponse,
  DEFAULT_UPLOAD_CONFIG,
} from '@/Types/bulkUpload.types';

import { API_BASE_URL } from '../utils/constants';

// Axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Upload Excel file with candidates
 */
export const uploadExcelFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<BulkUploadResponse>(
    '/bulkupload/upload-excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    }
  );

  return response.data;
};

/**
 * Get upload status by ID
 */
export const getBulkUploadStatus = async (
  bulkUploadId: string
): Promise<BulkUploadStatus> => {
  const response = await api.get<BulkUploadStatus>(
    `/bulkupload/status/${bulkUploadId}`
  );
  return response.data;
};

/**
 * Get all bulk uploads with pagination
 */
export const getAllBulkUploads = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<BulkUploadHistoryResponse> => {
  const response = await api.get<BulkUploadHistoryResponse>('/bulkupload/all', {
    params: { pageNumber, pageSize },
  });
  return response.data;
};

/**
 * Download Excel template
 */
export const downloadExcelTemplate = async (): Promise<void> => {
  const response = await api.get('/bulkupload/template', {
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `Candidate_Upload_Template_${new Date().toISOString().split('T')[0]}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
    };
  }

  // Check file size (10MB max)
  if (file.size > DEFAULT_UPLOAD_CONFIG.maxFileSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit',
    };
  }

  return { valid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Calculate success rate
 */
export const calculateSuccessRate = (
  successful: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100 * 10) / 10;
};

// Export API instance for custom requests
export default api;