import api from './api';
import { Room } from '../types';

export const roomService = {
  getAllRooms: async (): Promise<Room[]> => {
    const response = await api.get('/rooms');
    return response.data;
  },

  getAvailableRooms: async (date: string, startTime: string, endTime: string): Promise<Room[]> => {
    const response = await api.get('/rooms/available', {
      params: { date, startTime, endTime },
    });
    return response.data;
  },
  
  createRoom: async (data: Partial<Room>): Promise<Room> => {
    const response = await api.post('/rooms', data);
    return response.data;
  },

  updateRoom: async (id: string, data: Partial<Room>): Promise<Room> => {
    const response = await api.patch(`/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await api.delete(`/rooms/${id}`);
  },
};
