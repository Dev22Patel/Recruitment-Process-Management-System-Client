import axios from 'axios';
import type { CandidateDocument, UploadDocumentDto, VerifyDocumentDto } from '@/Types/document.types';

const API_URL = 'https://localhost:7057/api';

export const documentService = {
  async uploadDocument(dto: UploadDocumentDto): Promise<CandidateDocument> {
    const formData = new FormData();
    formData.append('candidateId', dto.candidateId);
    formData.append('documentType', dto.documentType);
    formData.append('file', dto.file);
    formData.append('isRequired', dto.isRequired.toString());

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/document/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async verifyDocument(dto: VerifyDocumentDto): Promise<CandidateDocument> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/document/verify`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getCandidateDocuments(candidateId: string): Promise<CandidateDocument[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/document/candidate/${candidateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getPendingVerification(): Promise<CandidateDocument[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/document/pending-verification`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async deleteDocument(documentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/document/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async hasRequiredDocuments(candidateId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/document/has-required/${candidateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.hasRequired;
  },
};