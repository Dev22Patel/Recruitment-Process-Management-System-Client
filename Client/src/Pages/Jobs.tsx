import { Briefcase } from 'lucide-react';

interface JobsProps {
  isProfileComplete: boolean;
}

export const Jobs = ({ isProfileComplete }: JobsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Browse Jobs</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          {isProfileComplete
            ? 'Jobs listing will be implemented here.'
            : 'Please complete your profile to browse jobs.'}
        </p>
      </div>
    </div>
  );
};
