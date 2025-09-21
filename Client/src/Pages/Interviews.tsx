// src/Pages/Interviews.tsx
import { Clock } from 'lucide-react';

interface InterviewsProps {
  isProfileComplete: boolean;
}

export const Interviews = ({ isProfileComplete }: InterviewsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Interviews</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {isProfileComplete
            ? 'Interview schedule will be shown here.'
            : 'Please complete your profile to view interviews.'}
        </p>
      </div>
    </div>
  );
};
