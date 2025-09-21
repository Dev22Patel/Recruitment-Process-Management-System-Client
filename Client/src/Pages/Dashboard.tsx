import { Button } from '@/Components/ui/Button';

interface DashboardProps {
  isProfileComplete: boolean;
  setActiveTab: (tab: string) => void;
}

export const Dashboard = ({ isProfileComplete, setActiveTab }: DashboardProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Welcome Back!</h3>
          <p className="text-gray-600">
            {isProfileComplete
              ? 'Your profile is complete. Start exploring job opportunities.'
              : 'Please complete your profile to access all features.'}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <p className="text-gray-600">No recent activity yet.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              size="sm"
              onClick={() => setActiveTab('jobs')}
              className="w-full"
              disabled={!isProfileComplete}
            >
              Browse Jobs
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('profile')}
              className="w-full"
            >
              {isProfileComplete ? 'Edit Profile' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
