// Types/admin.types.ts
export interface Role {
  id: number;
  roleName: string;
  isActive: boolean;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roleIds: number[]; // Multiple roles support
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleIds: number[];
}

export interface EmployeeFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  roleIds?: string;
}
