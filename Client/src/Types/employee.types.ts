export interface Employee {
  id: string;
  candidateId: string;
  employeeName: string;
  email: string;
  jobPositionId: string;
  jobTitle: string;
  employeeCode: string;
  joiningDate: string;
  department: string;
  statusId: number;
  statusName: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: string;
}

export interface CreateEmployeeDto {
  candidateId: string;
  jobPositionId: string;
  joiningDate: string;
  department: string;
}
