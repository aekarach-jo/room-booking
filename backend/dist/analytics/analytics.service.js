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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const [totalBookings, pendingBookings, approvedToday, totalRooms, activeRooms, bookingTrend, topRooms, peakHours, bookingByRole,] = await Promise.all([
            this.prisma.booking.count(),
            this.prisma.booking.count({
                where: { status: 'PENDING' },
            }),
            this.prisma.booking.count({
                where: {
                    status: 'APPROVED',
                    createdAt: {
                        gte: today,
                    },
                },
            }),
            this.prisma.room.count(),
            this.prisma.room.count({
                where: { isActive: true },
            }),
            this.getBookingTrend(7),
            this.getTopRooms(5),
            this.getPeakHours(),
            this.getBookingByRole(),
        ]);
        return {
            totalBookings,
            pendingBookings,
            approvedToday,
            availableRooms: activeRooms,
            totalRooms,
            bookingTrend,
            topRooms,
            peakHours,
            bookingByRole,
        };
    }
    async getBookingTrend(days) {
        const now = new Date();
        const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        const bookings = await this.prisma.booking.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                },
            },
            select: {
                createdAt: true,
            },
        });
        const trend = {};
        for (let i = 0; i < days; i++) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split('T')[0];
            trend[dateStr] = 0;
        }
        bookings.forEach((booking) => {
            const dateStr = booking.createdAt.toISOString().split('T')[0];
            if (trend[dateStr] !== undefined) {
                trend[dateStr]++;
            }
        });
        return Object.entries(trend)
            .map(([date, count]) => ({ date, count }))
            .reverse();
    }
    async getTopRooms(limit) {
        const bookings = await this.prisma.booking.groupBy({
            by: ['roomId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: limit,
        });
        const roomIds = bookings.map((b) => b.roomId);
        const rooms = await this.prisma.room.findMany({
            where: {
                id: {
                    in: roomIds,
                },
            },
        });
        const roomMap = new Map(rooms.map((r) => [r.id, r.name]));
        return bookings.map((b) => ({
            roomName: roomMap.get(b.roomId) || 'Unknown',
            count: b._count.id,
        }));
    }
    async getPeakHours() {
        const bookings = await this.prisma.booking.findMany({
            where: {
                status: {
                    in: ['APPROVED', 'PENDING'],
                },
            },
            select: {
                startTime: true,
            },
        });
        const hours = {};
        for (let i = 0; i < 24; i++) {
            hours[i] = 0;
        }
        bookings.forEach((booking) => {
            const hour = new Date(booking.startTime).getHours();
            hours[hour]++;
        });
        return Object.entries(hours)
            .map(([hour, count]) => ({
            hour: `${hour.padStart(2, '0')}:00`,
            count: count,
        }))
            .filter((h) => h.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    async getBookingByRole() {
        const bookings = await this.prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        role: true,
                    },
                },
            },
        });
        const roleCount = {};
        bookings.forEach((booking) => {
            const role = booking.user.role;
            roleCount[role] = (roleCount[role] || 0) + 1;
        });
        return Object.entries(roleCount).map(([role, count]) => ({
            role,
            count,
        }));
    }
    async getRoomUtilization() {
        const rooms = await this.prisma.room.findMany({
            include: {
                bookings: {
                    where: {
                        status: 'APPROVED',
                        date: {
                            gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
            },
        });
        return rooms.map((room) => {
            const totalHours = 30 * 12;
            const bookedHours = room.bookings.reduce((sum, booking) => {
                const start = new Date(booking.startTime);
                const end = new Date(booking.endTime);
                const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                return sum + hours;
            }, 0);
            const utilization = (bookedHours / totalHours) * 100;
            return {
                roomName: room.name,
                utilization: Math.round(utilization * 10) / 10,
                bookedHours: Math.round(bookedHours * 10) / 10,
                totalHours,
            };
        });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map