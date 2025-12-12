import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalBookings: number;
        pendingBookings: number;
        approvedToday: number;
        availableRooms: number;
        totalRooms: number;
        bookingTrend: {
            date: string;
            count: unknown;
        }[];
        topRooms: {
            roomName: string;
            count: number;
        }[];
        peakHours: {
            hour: string;
            count: number;
        }[];
        bookingByRole: {
            role: string;
            count: unknown;
        }[];
    }>;
    getBookingTrend(days: number): Promise<{
        date: string;
        count: unknown;
    }[]>;
    getTopRooms(limit: number): Promise<{
        roomName: string;
        count: number;
    }[]>;
    getPeakHours(): Promise<{
        hour: string;
        count: number;
    }[]>;
    getBookingByRole(): Promise<{
        role: string;
        count: unknown;
    }[]>;
    getRoomUtilization(): Promise<{
        roomName: string;
        utilization: number;
        bookedHours: number;
        totalHours: number;
    }[]>;
}
