// types/auth.ts (Updated version with role field)

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  role?: 'candidate' | 'admin' | 'recruiter' | 'hr' | 'interviewer' | 'reviewer';
  token: string;
  expiresAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface FormErrors {
  [key: string]: string;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType?: 'candidate' | 'Admin' | 'recruiter' | 'hr' | 'interviewer' | 'reviewer';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface AuthContextType extends AuthState {
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}
