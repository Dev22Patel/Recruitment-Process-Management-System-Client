// types/auth.ts

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
  confirmPassword?: string; // Frontend only field for validation
}

export interface LoginResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
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
  role?: 'candidate' | 'admin' | 'recruiter';
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string; // To match your existing response structure
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

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
