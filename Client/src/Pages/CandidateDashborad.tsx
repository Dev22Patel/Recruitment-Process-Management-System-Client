import { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_BASE_URL } from '../utils/constants';
import { Sidebar } from '../Components/layout/Sidebar';
import { Dashboard } from './Dashboard';
import { Jobs } from './Jobs';
import { Applications } from './Application/Applications';
import { Interviews } from './Interviews';
import { Documents } from './Documents';
import { Profile } from './Profile/Profile';
import CandidateOffers from './CandidateOffers';

const CandidateDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const checkProfileCompletion = async () => {
    if (!user?.userId) {
      setIsProfileComplete(false);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
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
        setIsProfileComplete(result.isComplete);
        if (!result.isComplete) {
          setActiveTab('profile');
          toast.info('Please complete your profile to access all features.');
        } else {
          toast.success('Welcome to your dashboard!');
        }
      } else if (response.status === 404) {
        setIsProfileComplete(false);
        setActiveTab('profile');
        toast.info('Please complete your profile to access all features.');
      } else {
        setIsProfileComplete(false);
        setActiveTab('profile');
        toast.error('Failed to verify profile status. Please complete your profile.');
      }
    } catch (error) {
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

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard isProfileComplete={!!isProfileComplete} setActiveTab={setActiveTab} />;
      case 'jobs':
        return <Jobs isProfileComplete={!!isProfileComplete} />;
      case 'applications':
        return <Applications />;
      case 'interviews':
        return <Interviews isProfileComplete={!!isProfileComplete} />;
      case 'documents':
        return <Documents isProfileComplete={!!isProfileComplete} />;
      case 'profile':
        return (
          <Profile
            isProfileComplete={!!isProfileComplete}
            setIsProfileComplete={setIsProfileComplete}
            setActiveTab={setActiveTab}
            checkProfileCompletion={checkProfileCompletion}
          />
        );
        case 'offers':
        return <CandidateOffers isProfileComplete={!!isProfileComplete} />;
      default:
        return <Dashboard isProfileComplete={!!isProfileComplete} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isProfileComplete={!!isProfileComplete}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
};

export default CandidateDashboard;