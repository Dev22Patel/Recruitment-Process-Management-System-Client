import { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/constants';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Trash2,
  Download,
  File,
  Loader2
} from 'lucide-react';

interface Document {
  id: string;
  candidateId: string;
  candidateName?: string;
  documentType: string;
  documentName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
  statusId: number;
  statusName?: string;
  isRequired: boolean;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

interface Application {
  id: string;
  applicationId?: string;
  candidateId?: string;
  jobTitle: string;
  currentStatus: string;
  statusId: number;
}

interface DocumentsProps {
  isProfileComplete: boolean;
}

const REQUIRED_DOCUMENTS = [
  { type: 'Resume', description: 'Updated resume/CV', required: true },
  { type: 'AadharCard', description: 'Aadhaar Card (front & back)', required: true },
  { type: 'PanCard', description: 'PAN Card', required: true },
  { type: 'EducationCertificate', description: 'Highest Education Certificate', required: true },
  { type: 'ExperienceLetter', description: 'Previous Employment Letter', required: false },
  { type: 'PaySlip', description: 'Last 3 months salary slips', required: false },
  { type: 'PhotoID', description: 'Passport size photograph', required: true },
  { type: 'AddressProof', description: 'Address Proof Document', required: true },
];

// Status IDs - adjust based on your backend
const DOCUMENT_STATUS = {
  PENDING: 22,
  VERIFIED: 23,
  REJECTED: 24,
};

export const Documents = ({ isProfileComplete }: DocumentsProps) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);

  useEffect(() => {
    if (isProfileComplete && user?.userId) {
      fetchCandidateProfile();
    } else {
      setLoading(false);
    }
  }, [isProfileComplete, user]);

  const fetchCandidateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Candidate/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const profile = await response.json();
        console.log('Candidate profile:', profile);
        const candId = profile.id;
        setCandidateId(candId);
        // Fetch data with candidate ID
        await fetchData(candId);
      } else {
        console.error('Failed to fetch candidate profile');
        toast.error('Failed to load profile');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching candidate profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchData = async (candId: string) => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDocuments(candId),
        fetchApplications()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (candId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Document/candidate/${candId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetched documents:', result);
        setDocuments(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Application/my-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Fetched applications:', result);
        // Fixed: Use statusName
        const selectedApps = result.filter((app: Application) => 
          app.currentStatus === 'Selected' || app.statusId === 6
        );
        console.log('Selected applications:', selectedApps);
        setApplications(selectedApps);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    if (!file) return;

    if (!candidateId) {
      toast.error('Candidate ID not found. Please refresh the page.');
      return;
    }

    console.log('Uploading file for document type:', documentType);

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    setUploading(documentType);
    
    const docTypeInfo = REQUIRED_DOCUMENTS.find(d => d.type === documentType);
    const isRequired = docTypeInfo?.required || false;
    
    const formData = new FormData();
    formData.append('CandidateId', candidateId);
    formData.append('DocumentType', documentType);
    formData.append('IsRequired', isRequired.toString());
    formData.append('File', file);

    console.log('=== UPLOAD DEBUG ===');
    console.log('CandidateId:', candidateId);
    console.log('DocumentType:', documentType);
    console.log('IsRequired:', isRequired);
    console.log('File:', file.name, file.size, file.type);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/Document/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        toast.success(`${documentType} uploaded successfully`);
        await fetchDocuments(candidateId);
      } else {
        let errorMessage = 'Failed to upload document';
        try {
          const error = await response.json();
          console.error('Error response:', error);
          errorMessage = error.message || JSON.stringify(error);
        } catch (e) {
          const textError = await response.text();
          console.error('Error text:', textError);
          errorMessage = textError || errorMessage;
        }
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (documentId: string, documentType: string) => {
    if (!confirm(`Are you sure you want to delete this ${documentType}?`)) return;

    setDeleting(documentId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/Document/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Document deleted successfully');
        if (candidateId) {
          await fetchDocuments(candidateId);
        }
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      toast.error('Failed to delete document');
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const getDocumentStatus = (docType: string) => {
    return documents.find(d => d.documentType === docType);
  };

  const getVerificationStatusBadge = (doc?: Document) => {
    if (!doc) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <Clock className="h-3 w-3" />
          Not Uploaded
        </span>
      );
    }

    if (doc.statusId === DOCUMENT_STATUS.VERIFIED) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" />
          Verified
        </span>
      );
    }

    if (doc.statusId === DOCUMENT_STATUS.REJECTED) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Clock className="h-3 w-3" />
        Under Review
      </span>
    );
  };

  const completionPercentage = () => {
    const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.required);
    const uploadedRequired = requiredDocs.filter(d => 
      documents.some(doc => doc.documentType === d.type)
    );
    return Math.round((uploadedRequired.length / requiredDocs.length) * 100);
  };

  const allRequiredVerified = () => {
    const requiredDocs = REQUIRED_DOCUMENTS.filter(d => d.required);
    return requiredDocs.every(d => {
      const doc = documents.find(doc => doc.documentType === d.type);
      return doc && doc.statusId === DOCUMENT_STATUS.VERIFIED;
    });
  };

  const isDocumentVerified = (doc: Document) => {
    return doc.statusId === DOCUMENT_STATUS.VERIFIED;
  };

  if (!isProfileComplete) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Documents</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Please complete your profile to access document management.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Documents</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">
            Document upload not available yet
          </p>
          <p className="text-sm text-gray-500">
            You'll be able to upload required documents once you're selected for a position.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Document Management</h2>
        <p className="text-gray-600">Upload and manage your employment documents</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">
              Congratulations! You've been selected
            </h3>
            <p className="text-sm text-green-800">
              Please upload the required documents below. Our HR team will verify them before proceeding with the offer.
            </p>
            <div className="mt-2 space-y-1">
              {applications.map(app => (
                <p key={app.id || app.applicationId} className="text-sm font-medium text-green-900">
                  • {app.jobTitle}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Upload Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{completionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage()}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {documents.filter(d => REQUIRED_DOCUMENTS.find(rd => rd.type === d.documentType && rd.required)).length} of{' '}
            {REQUIRED_DOCUMENTS.filter(d => d.required).length} required documents uploaded
          </span>
          {allRequiredVerified() && (
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle className="h-4 w-4" />
              All Verified
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {REQUIRED_DOCUMENTS.map((docType) => {
          const doc = getDocumentStatus(docType.type);
          const isUploading = uploading === docType.type;
          const isDeleting = deleting === doc?.id;

          return (
            <div
              key={docType.type}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{docType.type}</h3>
                    {docType.required && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{docType.description}</p>
                </div>
                {getVerificationStatusBadge(doc)}
              </div>

              {doc ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <File className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {doc.documentName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                          {isDocumentVerified(doc) && doc.verifiedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              ✓ Verified by {doc.verifiedByName} on{' '}
                              {new Date(doc.verifiedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a
                          href={doc.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View document"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        {!isDocumentVerified(doc) && (
                          <button
                            onClick={() => handleDelete(doc.id, docType.type)}
                            disabled={isDeleting}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete document"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isDocumentVerified(doc) && (
                    <div>
                      <label
                        htmlFor={`replace-${docType.type}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        <Upload className="h-4 w-4" />
                        Replace Document
                      </label>
                      <input
                        id={`replace-${docType.type}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(docType.type, file);
                        }}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {isUploading ? (
                    <div className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Uploading...</span>
                    </div>
                  ) : (
                    <label
                      htmlFor={`upload-${docType.type}`}
                      className="flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors group"
                    >
                      <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                          Click to upload {docType.type}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, JPG, or PNG (Max 10MB)
                        </p>
                      </div>
                    </label>
                  )}
                  <input
                    id={`upload-${docType.type}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(docType.type, file);
                    }}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Important Notes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All documents marked as "Required" must be uploaded</li>
          <li>• Documents will be verified by our HR team</li>
          <li>• You can replace unverified documents if needed</li>
          <li>• Verified documents cannot be modified</li>
          <li>• Maximum file size is 10MB per document</li>
          <li>• Accepted formats: PDF, JPG, PNG</li>
        </ul>
      </div>
    </div>
  );
};