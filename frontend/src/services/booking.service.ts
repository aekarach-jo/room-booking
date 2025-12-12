import api from './api';
import { Booking } from '../types';

export const bookingService = {
  createBooking: async (data: Partial<Booking>): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  approveBooking: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`/bookings/${id}/approve`);
    return response.data;
  },

  rejectBooking: async (id: string, adminNote: string): Promise<{ message: string }> => {
    const response = await api.patch(`/bookings/${id}/reject`, { adminNote });
    return response.data;
  },

  cancelBooking: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`/bookings/${id}/cancel`);
    return response.data;
  },
};
