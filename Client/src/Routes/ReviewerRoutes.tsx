import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/Context/AuthContext';

interface ReviewerRouteProps {
  children: ReactNode;
}

const ReviewerRoute = ({ children }: ReviewerRouteProps) => {
  const { user } = useAuth();

  // Check if user is a reviewer
  const isReviewer = user?.userType === 'reviewer' || user?.userType?.includes('Reviewer');

  if (!isReviewer) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ReviewerRoute;