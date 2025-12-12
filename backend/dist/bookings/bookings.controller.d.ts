import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    }>;
    findAll(user: JwtPayload): Promise<({
        room: {
            name: string;
            id: string;
            isActive: boolean;
            type: import(".prisma/client").$Enums.RoomType;
            capacity: number;
            equipment: import("@prisma/client/runtime/library").JsonValue | null;
            floor: number | null;
            building: string | null;
            description: string | null;
            openTime: string | null;
            closeTime: string | null;
            maxBookingHours: number | null;
            advanceBookingDays: number | null;
            requireApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    })[]>;
    findOne(id: string, user: JwtPayload): Promise<{
        user: {
            id: string;
            username: string;
            password: string;
            fullName: string;
            studentId: string | null;
            teacherId: string | null;
            department: string | null;
            year: number | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            noShowCount: number;
            isSuspended: boolean;
            suspendedUntil: Date | null;
            createdAt: Date;
        };
        room: {
            name: string;
            id: string;
            isActive: boolean;
            type: import(".prisma/client").$Enums.RoomType;
            capacity: number;
            equipment: import("@prisma/client/runtime/library").JsonValue | null;
            floor: number | null;
            building: string | null;
            description: string | null;
            openTime: string | null;
            closeTime: string | null;
            maxBookingHours: number | null;
            advanceBookingDays: number | null;
            requireApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    }>;
    approve(id: string): Promise<{
        message: string;
    }>;
    reject(id: string, adminNote: string): Promise<{
        message: string;
    }>;
    cancel(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
    getCalendarView(startDate: string, endDate: string): Promise<({
        user: {
            id: string;
            username: string;
            fullName: string;
            role: import(".prisma/client").$Enums.Role;
        };
        room: {
            name: string;
            id: string;
            isActive: boolean;
            type: import(".prisma/client").$Enums.RoomType;
            capacity: number;
            equipment: import("@prisma/client/runtime/library").JsonValue | null;
            floor: number | null;
            building: string | null;
            description: string | null;
            openTime: string | null;
            closeTime: string | null;
            maxBookingHours: number | null;
            advanceBookingDays: number | null;
            requireApproval: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    })[]>;
    batchApprove(bookingIds: string[]): Promise<{
        message: string;
        count: number;
    }>;
    checkIn(id: string): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    }>;
    checkOut(id: string): Promise<{
        id: string;
        createdAt: Date;
        date: Date;
        startTime: Date;
        endTime: Date;
        purpose: string;
        attendees: number;
        status: import(".prisma/client").$Enums.BookingStatus;
        adminNote: string | null;
        checkInTime: Date | null;
        checkOutTime: Date | null;
        isNoShow: boolean;
        updatedAt: Date;
        roomId: string;
        recurringBookingId: string | null;
        userId: string;
    }>;
}
