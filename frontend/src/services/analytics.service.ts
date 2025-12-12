import api from './api';

export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  approvedToday: number;
  availableRooms: number;
}

export interface BookingTrendData {
  date: string;
  count: number;
}

export interface RoomUtilizationData {
  roomName: string;
  count: number;
}

export interface PeakHourData {
  hour: string;
  count: number;
}

export interface BookingByRoleData {
  role: string;
  count: number;
}

export const analyticsService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/analytics/dashboard-stats');
    return response.data;
  },

  // Get booking trend
  getBookingTrend: async (days: number = 7): Promise<BookingTrendData[]> => {
    const response = await api.get(`/analytics/booking-trend?days=${days}`);
    return response.data;
  },

  // Get room utilization
  getRoomUtilization: async (): Promise<RoomUtilizationData[]> => {
    const response = await api.get('/analytics/room-utilization');
    return response.data;
  },

  // Get peak hours
  getPeakHours: async (): Promise<PeakHourData[]> => {
    const response = await api.get('/analytics/peak-hours');
    return response.data;
  },

  // Get booking by role
  getBookingByRole: async (): Promise<BookingByRoleData[]> => {
    const response = await api.get('/analytics/booking-by-role');
    return response.data;
  },
};
