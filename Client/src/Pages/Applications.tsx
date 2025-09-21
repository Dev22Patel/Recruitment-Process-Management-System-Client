// src/Pages/Applications.tsx
import { FileText } from 'lucide-react';

interface ApplicationsProps {
  isProfileComplete: boolean;
}

export const Applications = ({ isProfileComplete }: ApplicationsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {isProfileComplete
            ? 'Your applications will appear here.'
            : 'Please complete your profile to view applications.'}
        </p>
      </div>
    </div>
  );
};






