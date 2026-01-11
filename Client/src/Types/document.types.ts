export interface CandidateDocument {
  id: string;
  candidateId: string;
  candidateName: string;
  documentType: string;
  documentName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  statusId: number;
  statusName: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  isRequired: boolean;
  uploadedAt: string;
}

export interface UploadDocumentDto {
  candidateId: string;
  documentType: string;
  file: File;
  isRequired: boolean;
}

export interface VerifyDocumentDto {
  documentId: string;
  statusId: number;
  comments?: string;
}