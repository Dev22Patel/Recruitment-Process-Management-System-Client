import { useState, useEffect } from 'react';
import { Button } from '@/Components/ui/Button';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import {
  Home,
  Briefcase,
  User,
  Clock,
  FileText,
  LogOut,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/constants';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Browse Jobs', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Check profile completion
  const checkProfileCompletion = async () => {
    console.log(user);
    if (!user?.userId) {
      console.warn('User ID not available');
      setIsProfileComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setIsProfileComplete(false);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/Candidate/${user.userId}/isComplete`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Profile completion response:', result); // Debug API response
        setIsProfileComplete(result.isComplete);
        console.log('Is profile complete?', result.isComplete); // Debug completion status
        if (!result.isComplete) {
          setActiveTab('profile'); // Navigate to profile tab if incomplete
          toast.info('Please complete your profile to access all features.');
        } else {
          toast.success('Welcome to your dashboard!');
        }
      } else if (response.status === 404) {
        setIsProfileComplete(false);
        setActiveTab('profile'); // Navigate to profile tab if profile doesn't exist
        toast.info('Please complete your profile to access all features.');
      } else {
        console.error('Failed to check profile completion:', response.status, response.statusText);
        setIsProfileComplete(false);
        setActiveTab('profile');
        toast.error('Failed to verify profile status. Please complete your profile.');
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
      setIsProfileComplete(false);
      setActiveTab('profile');
      toast.error('An error occurred. Please complete your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkProfileCompletion();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking profile status...</p>
        </div>
      </div>
    );
  }

  // Normal dashboard for all cases
  return (
    <div className="min-h-screen bg-white">
      {/* Success Banner for completed profiles */}
      {isProfileComplete && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
          <div className="ml-64 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <p className="text-sm text-green-800">
              Profile complete! All features are now accessible.
            </p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JB</span>
              </div>
              <span className="font-semibold text-gray-900">JobBoard</span>
            </div>
          </div>

          {/* User Profile */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Profile Status */}
          <div className="px-4 py-2">
            <div
              className={`text-xs px-2 py-1 rounded-full text-center ${
                isProfileComplete
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              Profile: {isProfileComplete ? 'Complete ✓' : 'Incomplete'}
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-6">
          {activeTab === 'dashboard' && (
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
          )}

          {activeTab === 'jobs' && (
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
          )}

          {activeTab === 'applications' && (
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
          )}

          {activeTab === 'interviews' && (
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
          )}

          {activeTab === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      isProfileComplete
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isProfileComplete ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {isProfileComplete
                    ? 'Update your profile information here.'
                    : 'Please complete your profile to access all dashboard features.'}
                </p>
                {!isProfileComplete && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Note:</strong> This is where your profile form will be implemented.
                        Once completed, you'll have access to all dashboard features.
                      </p>
                    </div>
                    {/* Add your actual profile form here */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Form</h3>
                      <p className="text-gray-600 mb-4">Implement your profile form component here</p>
                      {/* Placeholder for actual form submission */}
                      <Button
                        onClick={async () => {
                          try {
                            if (!user || !user.UserId) {
                              toast.error('User information is missing. Please log in again.');
                              return;
                            }
                            const token = localStorage.getItem('token');
                            const response = await fetch(`${API_BASE_URL}/api/Candidate/${user.UserId}/completeProfile`, {
                              method: 'POST',
                              headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                              },
                              // Add body with profile data if needed
                            });
                            if (response.ok) {
                              setIsProfileComplete(true);
                              setActiveTab('dashboard');
                              toast.success('Profile completed! Welcome to your dashboard.');
                            } else {
                              toast.error('Failed to update profile.');
                            }
                          } catch (error) {
                            console.error('Error updating profile:', error);
                            toast.error('An error occurred while updating your profile.');
                          }
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Profile
                      </Button>
                    </div>
                  </div>
                )}
                <Button onClick={checkProfileCompletion} variant="outline" className="mt-4">
                  Refresh Profile Status
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;
