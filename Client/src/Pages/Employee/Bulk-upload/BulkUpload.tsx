import React, { useState, useCallback } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, History } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner'; // Changed from useToast hook
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Progress } from '@/Components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import BulkUploadHistory from './BulkUploadHistory';
import BulkUploadStatusModal from './BulkUploadStatusModal';
import {
  uploadExcelFile,
  downloadExcelTemplate,
  validateFile,
  formatFileSize,
} from '@/Services/bulkUploadService';
import { type BulkUploadResponse } from '@/Types/bulkUpload.types';

const BulkUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentBulkUploadId, setCurrentBulkUploadId] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        toast.error('Invalid File', {
          description: validation.error,
        });
        return;
      }

      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
      toast.success('File Selected', {
        description: `${file.name} (${formatFileSize(file.size)}) is ready to upload`,
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No File Selected', {
        description: 'Please select a file to upload',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadResult(null);

    try {
      const response = await uploadExcelFile(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      setUploadResult(response);
      setCurrentBulkUploadId(response.bulkUploadId);
      
      toast.success('Upload Successful', {
        description: response.message,
      });

      // Auto-open status modal
      setTimeout(() => setShowStatusModal(true), 1000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(errorMessage);
      
      toast.error('Upload Failed', {
        description: errorMessage,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadExcelTemplate();
      
      toast.success('Template Downloaded', {
        description: 'Excel template has been downloaded successfully',
      });
    } catch (err: any) {
      toast.error('Download Failed', {
        description: 'Failed to download template',
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
    setUploadProgress(0);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bulk Candidate Upload
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upload multiple candidate profiles at once using our Excel template
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Upload History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Download Template Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                Step 1: Download Template
              </CardTitle>
              <CardDescription>
                Download the Excel template and fill in candidate information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleDownloadTemplate}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Excel Template
              </Button>
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 text-blue-900 dark:text-blue-100">
                  Template Instructions:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Required fields: First Name, Last Name, Email, Phone Number</li>
                  <li>• Optional: Location, College, Degree, Graduation Year, Skills</li>
                  <li>• Skills should be comma-separated (e.g., C#, React, SQL)</li>
                  <li>• Email must be unique and valid</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-600" />
                Step 2: Upload Excel File
              </CardTitle>
              <CardDescription>
                Drag and drop your filled Excel file or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'
                  }
                  ${selectedFile ? 'bg-green-50 dark:bg-green-950 border-green-500' : ''}
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  {selectedFile ? (
                    <>
                      <CheckCircle2 className="h-16 w-16 text-green-600" />
                      <div>
                        <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="h-16 w-16 text-gray-400" />
                      <div>
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          {isDragActive ? 'Drop the file here' : 'Drag & drop Excel file here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          or click to browse (Max 10MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                    <span className="font-semibold">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Upload Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {uploadResult && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">
                    Upload Successful
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {uploadResult.message}
                    <br />
                    <span className="text-sm italic">{uploadResult.note}</span>
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Candidates
                    </>
                  )}
                </Button>

                {selectedFile && !isUploading && (
                  <Button onClick={handleReset} variant="outline">
                    Reset
                  </Button>
                )}

                {uploadResult && (
                  <Button 
                    onClick={() => setShowStatusModal(true)}
                    variant="secondary"
                  >
                    View Status
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <BulkUploadHistory onViewStatus={(id) => {
            setCurrentBulkUploadId(id);
            setShowStatusModal(true);
          }} />
        </TabsContent>
      </Tabs>

      {/* Status Modal */}
      {showStatusModal && currentBulkUploadId && (
        <BulkUploadStatusModal
          bulkUploadId={currentBulkUploadId}
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
};

export default BulkUpload;