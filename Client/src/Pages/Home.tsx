import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../Components/layout/Navbar';
import { Button } from '../Components/ui/Button';
import { APP_NAME } from '../utils/constants';

const Home = () => {
  useEffect(() => {
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-64px)] px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-lg text-gray-600">
              Streamline your recruitment process with our comprehensive management system
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/register" className="block">
              <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">
                Get Started - Register
              </Button>
            </Link>
            <Link to="/login" className="block">
              <Button variant="outline" size="lg" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer">
                Already have an account? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
