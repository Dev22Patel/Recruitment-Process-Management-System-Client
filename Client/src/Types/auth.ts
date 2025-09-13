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
