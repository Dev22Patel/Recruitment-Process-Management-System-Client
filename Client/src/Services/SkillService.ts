import axios from 'axios';

import { API_BASE_URL } from '../utils/constants';

export interface Skill {
  id: number;
  skillName: string;
  description?: string;
  isActive: boolean;
}

class SkillService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  }

  async getAllSkills(): Promise<Skill[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Skill`,
        this.getAuthHeader()
      );
      console.log('Fetched skills:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  }

  async getSkillById(id: number): Promise<Skill> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Skill/${id}`,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching skill:', error);
      throw error;
    }
  }

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Skill`,
        skill,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  async updateSkill(id: number, skill: Skill): Promise<Skill> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/Skill/${id}`,
        skill,
        this.getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  async deleteSkill(id: number): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE_URL}/Skill/${id}`,
        this.getAuthHeader()
      );
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }

  async deactivateSkill(id: number): Promise<void> {
    try {
      await axios.patch(
        `${API_BASE_URL}/Skill/${id}/deactivate`,
        {},
        this.getAuthHeader()
      );
    } catch (error) {
      console.error('Error deactivating skill:', error);
      throw error;
    }
  }
}

export const skillService = new SkillService();