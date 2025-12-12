export interface User {
    id: string;
    username: string;
    fullName: string;
    studentId?: string;
    teacherId?: string;
    department?: string;
    year?: number;
    role: 'STUDENT' | 'TEACHER' | 'STAFF' | 'DEPARTMENT_HEAD';
    isActive: boolean;
    noShowCount: number;
    isSuspended: boolean;
    suspendedUntil?: string;
    createdAt: string;
}
export interface Room {
    id: string;
    name: string;
    type: 'LECTURE' | 'COMPUTER_LAB' | 'LABORATORY' | 'MEETING' | 'STUDY';
    floor?: number;
    building?: string;
    capacity: number;
    equipment?: any;
    description?: string;
    openTime?: string;
    closeTime?: string;
    isActive: boolean;
    maxBookingHours?: number;
    advanceBookingDays?: number;
    requireApproval: boolean;
}
export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export interface Booking {
    id: string;
    userId: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    attendees: number;
    status: BookingStatus;
    adminNote?: string;
    checkInTime?: string;
    checkOutTime?: string;
    isNoShow: boolean;
    recurringBookingId?: string;
    createdAt: string;
    updatedAt: string;
    user?: User;
    room?: Room;
}
