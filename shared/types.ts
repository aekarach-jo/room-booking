// All types are based on the new prisma.schema from BACKOFFICE_PLAN.md

// Enums
export type Role = 'STUDENT' | 'TEACHER' | 'STAFF' | 'DEPARTMENT_HEAD';
export type RoomType = 'LECTURE' | 'COMPUTER_LAB' | 'LABORATORY' | 'MEETING' | 'STUDY';
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type RecurringPattern = 'DAILY' | 'WEEKLY' | 'CUSTOM';
export type SpecialDateType = 'HOLIDAY' | 'EXAM' | 'EVENT';
export type NotificationType = 'BOOKING_APPROVED' | 'BOOKING_REJECTED' | 'BOOKING_REMINDER' | 'BOOKING_CANCELLED' | 'ROOM_MAINTENANCE' | 'ANNOUNCEMENT';
export type AnnouncementType = 'INFO' | 'WARNING' | 'URGENT';


// Models
export interface User {
  id: string;
  username: string;
  fullName: string;
  studentId?: string | null;
  teacherId?: string | null;
  department?: string | null;
  year?: number | null;
  role: Role;
  isActive: boolean;
  noShowCount: number;
  isSuspended: boolean;
  suspendedUntil?: string | null; // DateTime as string
  createdAt: string; // DateTime as string
  bookings?: Booking[];
  // etc. for other relations
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  floor?: number | null;
  building?: string | null;
  capacity: number;
  equipment?: any | null; // JSON
  description?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  isActive: boolean;
  maxBookingHours?: number | null;
  advanceBookingDays?: number | null;
  requireApproval: boolean;
  bookings?: Booking[];
  maintenances?: RoomMaintenance[];
}

export interface Booking {
  id: string;
  userId: string;
  user?: User;
  roomId: string;
  room?: Room;
  date: string; // DateTime as string
  startTime: string; // DateTime as string
  endTime: string; // DateTime as string
  purpose: string;
  attendees: number;
  status: BookingStatus;
  adminNote?: string | null;
  checkInTime?: string | null; // DateTime as string
  checkOutTime?: string | null; // DateTime as string
  isNoShow: boolean;
  recurringBookingId?: string | null;
  recurringBooking?: RecurringBooking | null;
  createdAt: string; // DateTime as string
  updatedAt: string; // DateTime as string
}

export interface RecurringBooking {
    id: string;
    userId: string;
    user: User;
    roomId: string;
    room: Room;
    startDate: string; // DateTime as string
    endDate?: string | null; // DateTime as string
    pattern: RecurringPattern;
    daysOfWeek?: any | null; // JSON
    startTime: string;
    endTime: string;
    purpose: string;
    createdAt: string; // DateTime as string
    bookings?: Booking[];
}

export interface RoomMaintenance {
    id: string;
    roomId: string;
    room: Room;
    startDate: string; // DateTime as string
    endDate: string; // DateTime as string
    reason: string;
    createdAt: string; // DateTime as string
}

export interface Semester {
    id: string;
    name: string;
    startDate: string; // DateTime as string
    endDate: string; // DateTime as string
    isActive: boolean;
    createdAt: string; // DateTime as string
    specialDates?: SpecialDate[];
}

export interface SpecialDate {
    id: string;
    name: string;
    date: string; // DateTime as string
    type: SpecialDateType;
    description?: string | null;
    semesterId?: string | null;
    semester?: Semester | null;
}

export interface Notification {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string; // DateTime as string
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    isPinned: boolean;
    publishDate: string; // DateTime as string
    expiryDate?: string | null; // DateTime as string
    createdBy: string;
    creator: User;
    createdAt: string; // DateTime as string
}