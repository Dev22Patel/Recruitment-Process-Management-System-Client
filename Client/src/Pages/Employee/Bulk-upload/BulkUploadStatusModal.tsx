// Pages/Employee/BulkUploadStatusModal.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { X, CheckCircle2, XCircle, Loader2, Clock, FileText, User, Calendar } from 'lucide-react';
import { toast } from 'sonner'; // Changed from useToast hook
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Separator } from '@/Components/ui/separator';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';

interface BulkUploadStatus {
  id: string;
  fileName: string;
  uploadType: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  errorLog?: string;
  uploadedAt: string;
  uploadedByName: string;
  progressPercentage: number;
}

interface BulkUploadStatusModalProps {
  bulkUploadId: string;
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadStatusModal: React.FC<BulkUploadStatusModalProps> = ({
  bulkUploadId,
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<BulkUploadStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://localhost:7057/api';

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<BulkUploadStatus>(
        `${API_BASE_URL}/bulkupload/status/${bulkUploadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus(response.data);
    } catch (error: any) {
      toast.error('Failed to Load Status', {
        description: error.response?.data?.message || 'Could not fetch upload status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && bulkUploadId) {
      fetchStatus();

      // Auto-refresh every 5 seconds if processing
      const interval = setInterval(() => {
        if (status?.status === 'Processing') {
          fetchStatus();
        } else {
          clearInterval(interval);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen, bulkUploadId, status?.status]);

  const getStatusIcon = (statusName: string) => {
    switch (statusName) {
      case 'Processing':
        return <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />;
      case 'Completed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'Failed':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Status Details
          </DialogTitle>
          <DialogDescription>
            Real-time status of your bulk candidate upload
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : status ? (
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Status Overview */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{status.fileName}</h3>
                      <Badge className={getStatusColor(status.status)}>
                        {status.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {status.uploadedByName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(status.uploadedAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                {status.status === 'Processing' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Processing candidates...
                      </span>
                      <span className="font-semibold">{status.progressPercentage}%</span>
                    </div>
                    <Progress value={status.progressPercentage} className="h-3" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Statistics Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {status.totalRecords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Total Records
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {status.successfulRecords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Successful
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {status.failedRecords}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Failed
                  </div>
                </div>
              </div>

              {/* Success Rate */}
              {status.totalRecords > 0 && status.status === 'Completed' && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      {((status.successfulRecords / status.totalRecords) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(status.successfulRecords / status.totalRecords) * 100}
                    className="mt-2 h-2"
                  />
                </div>
              )}

              <Separator />

              {/* Error Log */}
              {status.errorLog && status.errorLog.trim() !== '' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Errors Encountered</AlertTitle>
                  <AlertDescription>
                    <ScrollArea className="max-h-48 mt-2">
                      <pre className="text-xs whitespace-pre-wrap font-mono">
                        {status.errorLog}
                      </pre>
                    </ScrollArea>
                  </AlertDescription>
                </Alert>
              )}

              {/* Processing Info */}
              {status.status === 'Processing' && (
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <AlertTitle className="text-blue-800 dark:text-blue-200">
                    Processing in Background
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    The upload is being processed. This page will automatically refresh.
                    You can close this dialog and check back later.
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Info */}
              {status.status === 'Completed' && status.successfulRecords > 0 && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">
                    Upload Completed Successfully
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {status.successfulRecords} candidate(s) have been successfully added to the system.
                    Welcome emails with login credentials have been sent to all candidates.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Status not found</p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={fetchStatus} variant="outline" size="sm">
            <Loader2 className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadStatusModal;