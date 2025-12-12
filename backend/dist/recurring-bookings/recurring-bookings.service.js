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
exports.RecurringBookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecurringBookingsService = class RecurringBookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId) {
        const recurringBooking = await this.prisma.recurringBooking.create({
            data: {
                userId,
                roomId: data.roomId,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                pattern: data.pattern,
                daysOfWeek: data.daysOfWeek,
                startTime: data.startTime,
                endTime: data.endTime,
                purpose: data.purpose,
            },
        });
        await this.generateBookings(recurringBooking.id);
        return recurringBooking;
    }
    async generateBookings(recurringBookingId) {
        const recurring = await this.prisma.recurringBooking.findUnique({
            where: { id: recurringBookingId },
            include: { user: true },
        });
        if (!recurring)
            return;
        const bookings = [];
        const currentDate = new Date(recurring.startDate);
        const endDate = recurring.endDate ? new Date(recurring.endDate) : new Date(recurring.startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
        while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            const shouldBook = recurring.pattern === 'DAILY' ||
                (recurring.pattern === 'WEEKLY' && recurring.daysOfWeek?.includes(dayOfWeek));
            if (shouldBook) {
                bookings.push({
                    userId: recurring.userId,
                    roomId: recurring.roomId,
                    date: new Date(currentDate),
                    startTime: new Date(`${currentDate.toISOString().split('T')[0]}T${recurring.startTime}`),
                    endTime: new Date(`${currentDate.toISOString().split('T')[0]}T${recurring.endTime}`),
                    purpose: recurring.purpose,
                    attendees: 1,
                    status: recurring.user.role === 'TEACHER' ? 'APPROVED' : 'PENDING',
                    recurringBookingId: recurring.id,
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (bookings.length > 0) {
            await this.prisma.booking.createMany({
                data: bookings,
                skipDuplicates: true,
            });
        }
        return bookings.length;
    }
    async findAll(userId) {
        return this.prisma.recurringBooking.findMany({
            where: userId ? { userId } : undefined,
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
                bookings: {
                    take: 5,
                    orderBy: {
                        date: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findOne(id) {
        const recurringBooking = await this.prisma.recurringBooking.findUnique({
            where: { id },
            include: {
                user: true,
                room: true,
                bookings: {
                    orderBy: {
                        date: 'asc',
                    },
                },
            },
        });
        if (!recurringBooking) {
            throw new common_1.NotFoundException(`Recurring booking with ID ${id} not found`);
        }
        return recurringBooking;
    }
    async update(id, data) {
        return this.prisma.recurringBooking.update({
            where: { id },
            data: {
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                purpose: data.purpose,
            },
        });
    }
    async remove(id) {
        await this.prisma.booking.deleteMany({
            where: {
                recurringBookingId: id,
                date: {
                    gte: new Date(),
                },
            },
        });
        return this.prisma.recurringBooking.delete({
            where: { id },
        });
    }
};
exports.RecurringBookingsService = RecurringBookingsService;
exports.RecurringBookingsService = RecurringBookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecurringBookingsService);
//# sourceMappingURL=recurring-bookings.service.js.map