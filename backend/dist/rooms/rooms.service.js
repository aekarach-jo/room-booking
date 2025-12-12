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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createRoomDto) {
        return this.prisma.room.create({ data: createRoomDto });
    }
    findAll() {
        return this.prisma.room.findMany();
    }
    findOne(id) {
        return this.prisma.room.findUnique({ where: { id } });
    }
    update(id, updateRoomDto) {
        return this.prisma.room.update({
            where: { id },
            data: updateRoomDto,
        });
    }
    remove(id) {
        return this.prisma.room.delete({ where: { id } });
    }
    async getAvailableRooms(date, startTime, endTime) {
        const overlappingBookings = await this.prisma.booking.findMany({
            where: {
                AND: [
                    { date: date },
                    {
                        OR: [
                            {
                                startTime: { gte: startTime, lt: endTime }
                            },
                            {
                                endTime: { gt: startTime, lte: endTime }
                            },
                            {
                                startTime: { lte: startTime },
                                endTime: { gte: endTime }
                            }
                        ]
                    },
                    {
                        status: { in: ['APPROVED', 'PENDING'] }
                    }
                ]
            },
            select: {
                roomId: true
            }
        });
        const unavailableRoomIds = overlappingBookings.map(b => b.roomId);
        return this.prisma.room.findMany({
            where: {
                id: {
                    notIn: unavailableRoomIds,
                },
                isActive: true,
            },
        });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map