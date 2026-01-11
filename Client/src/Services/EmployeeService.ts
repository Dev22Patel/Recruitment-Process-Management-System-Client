import axios from 'axios';
import type { Employee, CreateEmployeeDto } from '@/Types/employee.types';

const API_URL = 'https://localhost:7057/api';

export const employeeService = {
  async onboardCandidate(dto: CreateEmployeeDto): Promise<Employee> {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/employee/onboard`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getAllEmployees(): Promise<Employee[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/employee`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/employee/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },

  async getEmployeeByCode(code: string): Promise<Employee> {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/employee/code/${code}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
};