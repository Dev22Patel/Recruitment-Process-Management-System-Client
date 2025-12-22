import { Routes, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import ProtectedRoute from './ProtectedRoutes';
import PublicRoute from './PublicRoutes';
import CandidateDashboard from '@/Pages/CandidateDashborad';
import { EmployeeDashboard } from '@/Pages/Employee/EmployeeDashboard';
import Overview from '@/Pages/Employee/Overview';
import JobPositionsList from '@/Pages/Employee/JobPositions/JobPositionList';
import CreateJobPosition from '@/Pages/Employee/JobPositions/CreateJobPosition';
import JobPositionDetails from '@/Pages/Employee/JobPositions/JobPositionDetails';
import AllApplications from '@/Pages/Employee/Applications/AllApplications';
import ApplicationDetails from '@/Pages/Employee/Applications/ApplicationDetails';
import AnalyticsDashboard from '@/Pages/Employee/Statistics/AnalyticsDashboard';
import EditJobPosition from '@/Pages/Employee/JobPositions/EditJobPosition';
import InterviewList from '@/Pages/Employee/Interviews/InterviewList';
import ScheduleInterview from '@/Pages/Employee/Interviews/ScheduleInterview';
import InterviewDetails from '@/Pages/Employee/Interviews/InterviewDetails';
import MyInterviews from '@/Pages/Employee/Interviews/MyInterviews';
import SubmitFeedback from '@/Pages/Employee/Interviews/SubmitFeedback';
import AdminDashboard from '@/Pages/Admin/AdminDashboard';

// Screening Pages
import { PendingScreenings } from '@/Pages/Employee/Screening/PendingScreenings';
import { ScreeningDetails } from '@/Pages/Employee/Screening/ScreeningDetails';
import { ScreeningStatistics } from '@/Pages/Employee/Screening/ScreeningStatistics';
import { MyScreenings } from '@/Pages/Employee/Screening/MyScreenings';

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

      {/* Employee Routes */}
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Overview />} />

        {/* Job Positions */}
        <Route path="jobs" element={<JobPositionsList />} />
        <Route path="jobs/create" element={<CreateJobPosition />} />
        <Route path="jobs/:id" element={<JobPositionDetails />} />
        <Route path="jobs/edit/:id" element={<EditJobPosition />} />

        {/* Applications */}
        <Route path="applications" element={<AllApplications />} />
        <Route path="applications/:id" element={<ApplicationDetails />} />

        {/* Screening (Reviewer Only) */}
        <Route path="screening/pending" element={<PendingScreenings />} />
        <Route path="screening/review/:applicationId" element={<ScreeningDetails />} />
        <Route path="screening/statistics" element={<ScreeningStatistics />} />
        <Route path="screening/my-screenings" element={<MyScreenings />} />

        {/* Analytics */}
        <Route path="analytics" element={<AnalyticsDashboard />} />

        {/* Interviews */}
        <Route path="interviews" element={<InterviewList />} />
        <Route path="interviews/schedule/:applicationId" element={<ScheduleInterview />} />
        <Route path="interviews/:id" element={<InterviewDetails />} />
        <Route path="my-interviews" element={<MyInterviews />} />
        <Route path="interviews/:id/feedback" element={<SubmitFeedback />} />
      </Route>
      
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<div className="text-center pt-20">Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;