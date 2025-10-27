import { useState, useCallback } from 'react';
import { useAuth } from '../Context/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import { toast } from 'sonner';

interface UseProfileCompletionReturn {
  isProfileComplete: boolean | null;
  isLoading: boolean;
  checkProfileCompletion: () => Promise<void>;
  refreshProfileStatus: () => Promise<void>;
}

export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const checkProfileCompletion = useCallback(async () => {
    if (!user?.userId) {
      setIsProfileComplete(null);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/Candidate/${user.userId}/isComplete`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIsProfileComplete(result.isComplete);
        return result.isComplete;
      } else if (response.status === 404) {
        // Profile not found, needs to be created
        setIsProfileComplete(false);
        return false;
      } else {
        console.error('Failed to check profile completion');
        throw new Error('Failed to check profile completion');
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
      toast.error('Failed to check profile status');
      setIsProfileComplete(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const refreshProfileStatus = useCallback(async () => {
    await checkProfileCompletion();
    toast.success('Profile status refreshed');
  }, [checkProfileCompletion]);

  return {
    isProfileComplete,
    isLoading,
    checkProfileCompletion,
    refreshProfileStatus
  };
};
