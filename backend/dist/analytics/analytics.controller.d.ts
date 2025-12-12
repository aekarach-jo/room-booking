import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
    getBookingTrend(days?: string): Promise<{
        date: string;
        count: unknown;
    }[]>;
    getRoomUtilization(): Promise<{
        roomName: string;
        utilization: number;
        bookedHours: number;
        totalHours: number;
    }[]>;
    getPeakHours(): Promise<{
        hour: string;
        count: number;
    }[]>;
    getBookingByRole(): Promise<{
        role: string;
        count: unknown;
    }[]>;
}
