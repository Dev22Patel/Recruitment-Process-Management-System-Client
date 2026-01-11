import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Eye, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table';
import { Progress } from '@/Components/ui/progress';
import { toast } from 'sonner';

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

interface BulkUploadHistoryProps {
  onViewStatus: (id: string) => void;
}

const BulkUploadHistory: React.FC<BulkUploadHistoryProps> = ({ onViewStatus }) => {
  const [uploads, setUploads] = useState<BulkUploadStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber] = useState(1);
  const [pageSize] = useState(10);

  const API_BASE_URL = 'https://localhost:7057/api';

  const fetchUploads = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<{ data: BulkUploadStatus[] }>(
        `${API_BASE_URL}/bulkupload/all?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUploads(response.data.data || []);
    } catch (error: any) {
      toast.error(
        'Failed to Load History',{
        description: error.response?.data?.message || 'Could not fetch upload history',
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
    const interval = setInterval(() => {
      const hasProcessing = uploads.some(u => u.status === 'Processing');
      if (hasProcessing) {
        fetchUploads();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [pageNumber]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Processing':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Upload History
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              View all previous bulk upload operations
            </CardDescription>
          </div>
          <Button 
            onClick={fetchUploads} 
            variant="outline" 
            size="sm" 
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-gray-400" />
          </div>
        ) : uploads.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900">No upload history</p>
            <p className="text-sm text-gray-500 mt-1">
              Upload your first Excel file to see it here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-700">File Name</TableHead>
                  <TableHead className="font-semibold text-gray-700">Uploaded At</TableHead>
                  <TableHead className="font-semibold text-gray-700">Uploaded By</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Total</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Success</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Failed</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Progress</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload) => (
                  <TableRow key={upload.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-sm text-gray-900">
                      {upload.fileName}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(upload.uploadedAt), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="text-sm text-gray-700">
                      {upload.uploadedByName}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                        {upload.totalRecords}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded border border-emerald-200">
                        {upload.successfulRecords}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 text-xs font-medium text-rose-700 bg-rose-50 rounded border border-rose-200">
                        {upload.failedRecords}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(upload.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Progress 
                          value={upload.progressPercentage} 
                          className="h-1.5 w-20 bg-gray-200" 
                        />
                        <span className="text-xs font-medium text-gray-600 min-w-[2.5rem] text-right">
                          {upload.progressPercentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => onViewStatus(upload.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkUploadHistory;