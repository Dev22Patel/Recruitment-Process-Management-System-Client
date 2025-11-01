import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import type { LoginRequest, FormErrors } from '../../Types/auth';
import { Button } from '../ui/Button';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../utils/constants';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();


      if (response.ok) {
        console.log('Login successful:', result);

        // Use AuthContext login method
        login(result.token, result);

        // Show success toast
        toast.success(`Welcome back, ${result.firstName}!`);

        // Navigate based on user role
        const userRole = result.userType?.toLowerCase();



        if (userRole === 'candidate') {
          navigate('/dashboard');
        } else if (userRole === 'employee') {
          setTimeout(() => {
            navigate('/employee/dashboard');
        }, 1);
        } else {
          // Fallback for unknown roles
          navigate('/dashboard');
        }

      } else {
        setErrors({ submit: result.message || 'Login failed' });
        toast.error(result.message || 'Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-300 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
