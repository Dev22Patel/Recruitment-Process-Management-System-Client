import { useEffect, useState } from 'react';
import { documentService } from '@/Services/DocumentService';
import type { CandidateDocument } from '@/Types/document.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, FileText, User, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const DocumentVerification = () => {
  const [documents, setDocuments] = useState<CandidateDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<CandidateDocument | null>(null);
  const [verifying, setVerifying] = useState(false);

  // CORRECT STATUS IDs FROM YOUR TABLE
  const VERIFIED_STATUS_ID = 28;
  const REJECTED_STATUS_ID = 29;

  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  const fetchPendingDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getPendingVerification();
      setDocuments(data);
    } catch (error: any) {
      toast.error('Failed to fetch documents', {
        description: error.response?.data?.message || 'Could not load pending documents',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentId: string, statusId: number) => {
    try {
      setVerifying(true);
      await documentService.verifyDocument({
        documentId,
        statusId,
      });

      toast.success(statusId === VERIFIED_STATUS_ID ? 'Document verified' : 'Document rejected');
      fetchPendingDocuments();
      setSelectedDoc(null);
    } catch (error: any) {
      toast.error('Verification failed', {
        description: error.response?.data?.message,
      });
    } finally {
      setVerifying(false);
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'Resume':
        return '📄';
      case 'ID_Proof':
        return '🪪';
      case 'Address_Proof':
        return '🏠';
      case 'Education_Certificate':
        return '🎓';
      default:
        return '📋';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
        <p className="text-gray-600 mt-1">Review and verify candidate documents</p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No pending documents</p>
            <p className="text-sm text-gray-500 mt-1">All documents have been verified</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pending Verification ({documents.length})</span>
                  <Button size="sm" variant="outline" onClick={fetchPendingDocuments}>
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">{getDocumentTypeIcon(doc.documentType)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 truncate">{doc.candidateName}</p>
                            {doc.isRequired && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {doc.documentType.replace('_', ' ')}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(doc.uploadedAt), 'MMM dd, yyyy HH:mm')}
                          </div>
                        </div>
                      </div>
                      <Eye className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Document Preview & Actions */}
          <div className="space-y-4">
            {selectedDoc ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Document Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Candidate</label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-900">{selectedDoc.candidateName}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Document Type</label>
                      <p className="text-gray-900 mt-1">{selectedDoc.documentType.replace('_', ' ')}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">File Name</label>
                      <p className="text-gray-900 mt-1 truncate">{selectedDoc.documentName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">File Size</label>
                        <p className="text-gray-900 mt-1">{formatFileSize(selectedDoc.fileSize)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <p className="text-gray-900 mt-1">{selectedDoc.contentType}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">Uploaded At</label>
                      <p className="text-gray-900 mt-1">
                        {format(new Date(selectedDoc.uploadedAt), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>

                    {selectedDoc.isRequired && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          ⚠️ This is a required document for the candidate
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Document Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <a
                        href={selectedDoc.filePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Document →
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Verification Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerify(selectedDoc.id, VERIFIED_STATUS_ID)}
                      disabled={verifying}
                    >
                      {verifying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Verify Document
                    </Button>
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => handleVerify(selectedDoc.id, REJECTED_STATUS_ID)}
                      disabled={verifying}
                    >
                      {verifying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject Document
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a document to review</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentVerification;