"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const roles_enum_1 = require("../shared/enums/roles.enum");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createBookingDto, user) {
        const { roomId, date, startTime, endTime } = createBookingDto;
        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room) {
            throw new common_1.NotFoundException('Room not found');
        }
        if (!room.isActive) {
            throw new common_1.ConflictException('Room is not available for booking');
        }
        const overlappingBookings = await this.prisma.booking.findMany({
            where: {
                roomId,
                date: new Date(date),
                status: { in: [client_1.BookingStatus.PENDING, client_1.BookingStatus.APPROVED] },
                OR: [
                    { startTime: { lt: new Date(endTime) }, endTime: { gt: new Date(startTime) } },
                ],
            },
        });
        if (overlappingBookings.length > 0) {
            throw new common_1.ConflictException('Room is already booked for the selected time');
        }
        const initialStatus = user.role === roles_enum_1.Role.TEACHER ? client_1.BookingStatus.APPROVED : client_1.BookingStatus.PENDING;
        return this.prisma.booking.create({
            data: {
                ...createBookingDto,
                date: new Date(date),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                userId: user.id,
                status: initialStatus,
            },
        });
    }
    async findAll(user) {
        if (user.role === roles_enum_1.Role.STAFF || user.role === roles_enum_1.Role.DEPARTMENT_HEAD) {
            return this.prisma.booking.findMany({ include: { user: true, room: true } });
        }
        return this.prisma.booking.findMany({
            where: { userId: user.id },
            include: { room: true },
        });
    }
    async findOne(id, user) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { user: true, room: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (user.role !== roles_enum_1.Role.STAFF && user.role !== roles_enum_1.Role.DEPARTMENT_HEAD && booking.userId !== user.id) {
            throw new common_1.ForbiddenException('You are not allowed to view this booking');
        }
        return booking;
    }
    async approve(id) {
        await this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.APPROVED },
        });
        return { message: 'Booking approved' };
    }
    async reject(id, adminNote) {
        await this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.REJECTED, adminNote },
        });
        return { message: 'Booking rejected' };
    }
    async getCalendarView(startDate, endDate) {
        return this.prisma.booking.findMany({
            where: {
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                        role: true,
                    },
                },
                room: true,
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' },
            ],
        });
    }
    async batchApprove(bookingIds) {
        await this.prisma.booking.updateMany({
            where: {
                id: { in: bookingIds },
                status: client_1.BookingStatus.PENDING,
            },
            data: {
                status: client_1.BookingStatus.APPROVED,
            },
        });
        return { message: `${bookingIds.length} bookings approved`, count: bookingIds.length };
    }
    async checkIn(id) {
        return this.prisma.booking.update({
            where: { id },
            data: { checkInTime: new Date() },
        });
    }
    async checkOut(id) {
        return this.prisma.booking.update({
            where: { id },
            data: { checkOutTime: new Date() },
        });
    }
    async cancel(id, user) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (user.role !== roles_enum_1.Role.STAFF && booking.userId !== user.id) {
            throw new common_1.ForbiddenException('You are not allowed to cancel this booking');
        }
        if (booking.status !== client_1.BookingStatus.PENDING && booking.status !== client_1.BookingStatus.APPROVED) {
            throw new common_1.ConflictException(`Cannot cancel a booking with status ${booking.status}`);
        }
        await this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
        return { message: 'Booking cancelled' };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map