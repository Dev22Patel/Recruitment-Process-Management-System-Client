// src/Pages/Profile/ResumeUpload.tsx
import { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../utils/constants';

interface ResumeUploadProps {
  currentResumeUrl?: string;
  onUploadSuccess: (url: string) => void;
  userId?: string; // Add userId prop
}

export const ResumeUpload = ({ currentResumeUrl, onUploadSuccess }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resumeFile', selectedFile);
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).userId : null;
      console.log('User ID:', userId);

      console.log('Uploading resume:', selectedFile.name);

      const response = await fetch(`${API_BASE_URL}/Candidate/${userId}/upload-resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const data = await response.json();
        const resumeUrl = data.url || data.resumeUrl || data.filePath;

        onUploadSuccess(resumeUrl);
        toast.success('Resume uploaded successfully!');
        setSelectedFile(null);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log the full error
        toast.error(errorData.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('An error occurred while uploading your resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        <Upload className="inline h-4 w-4 mr-1" />
        Resume (PDF only, max 5MB)
      </label>

      {/* Current Resume Display */}
      {currentResumeUrl && !selectedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Resume uploaded</p>
              <p className="text-xs text-green-700 truncate max-w-xs">{currentResumeUrl}</p>
            </div>
          </div>
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-600 hover:text-green-700 underline"
          >
            View
          </a>
        </div>
      )}

      {/* File Selection */}
      {!selectedFile ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Upload className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              {currentResumeUrl ? 'Upload new resume' : 'Choose PDF file'}
            </span>
          </label>
        </div>
      ) : (
        /* Selected File Display */
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-blue-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-blue-700">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="ml-2 text-blue-600 hover:text-blue-700 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
