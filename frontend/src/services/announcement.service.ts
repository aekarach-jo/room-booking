import api from './api';

export enum AnnouncementType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  URGENT = 'URGENT',
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  isPinned: boolean;
  publishDate: string;
  expiryDate?: string;
  createdBy: string;
  creator?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface CreateAnnouncementDto {
  title: string;
  content: string;
  type: AnnouncementType;
  publishDate?: string;
  expiryDate?: string;
}

export interface UpdateAnnouncementDto {
  title?: string;
  content?: string;
  type?: AnnouncementType;
  publishDate?: string;
  expiryDate?: string;
}

export const announcementService = {
  // Get all active announcements
  getAll: async (): Promise<Announcement[]> => {
    const response = await api.get('/announcements');
    return response.data;
  },

  // Get announcement by ID
  getById: async (id: string): Promise<Announcement> => {
    const response = await api.get(`/announcements/${id}`);
    return response.data;
  },

  // Create announcement
  create: async (data: CreateAnnouncementDto): Promise<Announcement> => {
    const response = await api.post('/announcements', data);
    return response.data;
  },

  // Update announcement
  update: async (id: string, data: UpdateAnnouncementDto): Promise<Announcement> => {
    const response = await api.patch(`/announcements/${id}`, data);
    return response.data;
  },

  // Toggle pin status
  togglePin: async (id: string): Promise<Announcement> => {
    const response = await api.patch(`/announcements/${id}/pin`);
    return response.data;
  },

  // Delete announcement
  delete: async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
  },
};
