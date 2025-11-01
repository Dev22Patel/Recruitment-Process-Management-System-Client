import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ProtectedRoute from './ProtectedRoutes';
import PublicRoute from './PublicRoutes';
import CandidateDashboard from '@/Pages/CandidateDashborad';
import { EmployeeDashboard } from '@/Pages/Employee/EmployeeDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route for 404 */}
      <Route path="*" element={<div className="text-center pt-20">Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
