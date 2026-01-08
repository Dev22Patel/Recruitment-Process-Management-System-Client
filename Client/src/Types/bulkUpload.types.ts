

export interface BulkUploadResponse {
  message: string;
  bulkUploadId: string;
  note: string;
}

export interface BulkUploadStatus {
  id: string;
  fileName: string;
  uploadType: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: 'Processing' | 'Completed' | 'Failed';
  errorLog?: string;
  uploadedAt: string;
  uploadedByName: string;
  progressPercentage: number;
}

export interface BulkUploadHistoryResponse {
  pageNumber: number;
  pageSize: number;
  data: BulkUploadStatus[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedExtensions: string[];
  apiBaseUrl: string;
}

// Default configuration
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedExtensions: ['.xlsx', '.xls'],
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
};

// Status color mapping
export const STATUS_COLORS: Record<string, string> = {
  Processing: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
  Failed: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
};

// Excel template column definitions
export interface ExcelColumn {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'date';
  example: string;
  description: string;
}

export const EXCEL_TEMPLATE_COLUMNS: ExcelColumn[] = [
  {
    name: 'FirstName',
    required: true,
    type: 'string',
    example: 'John',
    description: 'Candidate first name',
  },
  {
    name: 'LastName',
    required: true,
    type: 'string',
    example: 'Doe',
    description: 'Candidate last name',
  },
  {
    name: 'Email',
    required: true,
    type: 'string',
    example: 'john.doe@example.com',
    description: 'Valid email address',
  },
  {
    name: 'PhoneNumber',
    required: true,
    type: 'string',
    example: '9876543210',
    description: '10-digit phone number',
  },
  {
    name: 'CurrentLocation',
    required: false,
    type: 'string',
    example: 'Mumbai',
    description: 'Current city',
  },
  {
    name: 'CollegeName',
    required: false,
    type: 'string',
    example: 'IIT Bombay',
    description: 'College/University name',
  },
  {
    name: 'Degree',
    required: false,
    type: 'string',
    example: 'B.Tech Computer Science',
    description: 'Degree qualification',
  },
  {
    name: 'GraduationYear',
    required: false,
    type: 'number',
    example: '2024',
    description: 'Year of graduation',
  },
  {
    name: 'Skills',
    required: false,
    type: 'string',
    example: 'C#, React, SQL',
    description: 'Comma-separated skills',
  },
  {
    name: 'TotalExperience',
    required: false,
    type: 'number',
    example: '2.5',
    description: 'Years of experience',
  },
  {
    name: 'CurrentCompany',
    required: false,
    type: 'string',
    example: 'Tech Corp',
    description: 'Current employer',
  },
];