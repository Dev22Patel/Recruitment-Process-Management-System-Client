import { Link } from 'react-router-dom';
import Navbar from '../Components/layout/Navbar';
import LoginForm from '../Components/auth/LoginForm';
import { useEffect } from 'react';

const Login = () => {
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
    <>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to your account
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <LoginForm />

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-500 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
