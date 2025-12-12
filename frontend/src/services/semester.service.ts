import api from './api';

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSemesterDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSemesterDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export const semesterService = {
  // Get all semesters
  getAll: async (): Promise<Semester[]> => {
    const response = await api.get('/semesters');
    return response.data;
  },

  // Get active semester
  getActive: async (): Promise<Semester | null> => {
    const response = await api.get('/semesters/active');
    return response.data;
  },

  // Get semester by ID
  getById: async (id: string): Promise<Semester> => {
    const response = await api.get(`/semesters/${id}`);
    return response.data;
  },

  // Create semester
  create: async (data: CreateSemesterDto): Promise<Semester> => {
    const response = await api.post('/semesters', data);
    return response.data;
  },

  // Update semester
  update: async (id: string, data: UpdateSemesterDto): Promise<Semester> => {
    const response = await api.patch(`/semesters/${id}`, data);
    return response.data;
  },

  // Activate semester
  activate: async (id: string): Promise<Semester> => {
    const response = await api.patch(`/semesters/${id}/activate`);
    return response.data;
  },

  // Delete semester
  delete: async (id: string): Promise<void> => {
    await api.delete(`/semesters/${id}`);
  },
};
