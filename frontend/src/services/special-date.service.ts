import api from './api';

export enum SpecialDateType {
  HOLIDAY = 'HOLIDAY',
  EXAM = 'EXAM',
  EVENT = 'EVENT',
}

export interface SpecialDate {
  id: string;
  name: string;
  date: string;
  type: SpecialDateType;
  description?: string;
  semesterId?: string;
  createdAt: string;
}

export interface CreateSpecialDateDto {
  name: string;
  date: string;
  type: SpecialDateType;
  description?: string;
  semesterId?: string;
}

export interface UpdateSpecialDateDto {
  name?: string;
  date?: string;
  type?: SpecialDateType;
  description?: string;
  semesterId?: string;
}

export const specialDateService = {
  // Get all special dates
  getAll: async (): Promise<SpecialDate[]> => {
    const response = await api.get('/special-dates');
    return response.data;
  },

  // Get special dates by month
  getByMonth: async (month: number, year: number): Promise<SpecialDate[]> => {
    const response = await api.get(`/special-dates?month=${month}&year=${year}`);
    return response.data;
  },

  // Get special date by ID
  getById: async (id: string): Promise<SpecialDate> => {
    const response = await api.get(`/special-dates/${id}`);
    return response.data;
  },

  // Create special date
  create: async (data: CreateSpecialDateDto): Promise<SpecialDate> => {
    const response = await api.post('/special-dates', data);
    return response.data;
  },

  // Update special date
  update: async (id: string, data: UpdateSpecialDateDto): Promise<SpecialDate> => {
    const response = await api.patch(`/special-dates/${id}`, data);
    return response.data;
  },

  // Delete special date
  delete: async (id: string): Promise<void> => {
    await api.delete(`/special-dates/${id}`);
  },
};
