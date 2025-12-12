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
exports.SpecialDatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SpecialDatesService = class SpecialDatesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.specialDate.create({
            data: {
                name: data.name,
                date: new Date(data.date),
                type: data.type,
                description: data.description,
                semesterId: data.semesterId,
            },
        });
    }
    async findAll() {
        return this.prisma.specialDate.findMany({
            include: {
                semester: true,
            },
            orderBy: {
                date: 'asc',
            },
        });
    }
    async findByMonth(month, year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        return this.prisma.specialDate.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                semester: true,
            },
            orderBy: {
                date: 'asc',
            },
        });
    }
    async findOne(id) {
        const specialDate = await this.prisma.specialDate.findUnique({
            where: { id },
            include: {
                semester: true,
            },
        });
        if (!specialDate) {
            throw new common_1.NotFoundException(`Special date with ID ${id} not found`);
        }
        return specialDate;
    }
    async update(id, data) {
        return this.prisma.specialDate.update({
            where: { id },
            data: {
                name: data.name,
                date: data.date ? new Date(data.date) : undefined,
                type: data.type,
                description: data.description,
                semesterId: data.semesterId,
            },
        });
    }
    async remove(id) {
        return this.prisma.specialDate.delete({
            where: { id },
        });
    }
};
exports.SpecialDatesService = SpecialDatesService;
exports.SpecialDatesService = SpecialDatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecialDatesService);
//# sourceMappingURL=special-dates.service.js.map