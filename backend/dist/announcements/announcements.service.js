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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnnouncementsService = class AnnouncementsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, createdBy) {
        return this.prisma.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                type: data.type || 'INFO',
                isPinned: data.isPinned || false,
                publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
                createdBy,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                    },
                },
            },
        });
    }
    async findActive() {
        const now = new Date();
        return this.prisma.announcement.findMany({
            where: {
                publishDate: {
                    lte: now,
                },
                OR: [
                    { expiryDate: null },
                    {
                        expiryDate: {
                            gte: now,
                        },
                    },
                ],
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                    },
                },
            },
            orderBy: [
                { isPinned: 'desc' },
                { publishDate: 'desc' },
            ],
        });
    }
    async findOne(id) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                    },
                },
            },
        });
        if (!announcement) {
            throw new common_1.NotFoundException(`Announcement with ID ${id} not found`);
        }
        return announcement;
    }
    async update(id, data) {
        return this.prisma.announcement.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                type: data.type,
                publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
            },
        });
    }
    async togglePin(id) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
        });
        return this.prisma.announcement.update({
            where: { id },
            data: { isPinned: !announcement.isPinned },
        });
    }
    async remove(id) {
        return this.prisma.announcement.delete({
            where: { id },
        });
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map