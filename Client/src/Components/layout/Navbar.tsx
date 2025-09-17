import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { APP_NAME } from '../../utils/constants';
import { toast } from 'sonner';

const Navbar = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="text-2xl font-bold text-black hover:text-green-900 transition-colors"
            >
              {APP_NAME}
            </Link>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-2xl font-bold text-black hover:text-green-900 transition-colors"
          >
            {APP_NAME}
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* User info */}
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="text-gray-600">Welcome, </span>
                    <span className="font-medium text-gray-900">
                      {user.firstName}
                    </span>
                  </div>

                  {/* User avatar */}
                  <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user.firstName?.charAt(0).toUpperCase()}
                    {user.lastName?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Dashboard link */}
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login/Register links for non-authenticated users */}
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
