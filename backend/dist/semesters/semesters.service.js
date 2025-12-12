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
exports.SemestersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SemestersService = class SemestersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.semester.create({
            data: {
                name: data.name,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                isActive: data.isActive || false,
            },
        });
    }
    async findAll() {
        return this.prisma.semester.findMany({
            include: {
                specialDates: true,
            },
            orderBy: {
                startDate: 'desc',
            },
        });
    }
    async findActive() {
        return this.prisma.semester.findFirst({
            where: { isActive: true },
            include: {
                specialDates: true,
            },
        });
    }
    async findOne(id) {
        const semester = await this.prisma.semester.findUnique({
            where: { id },
            include: {
                specialDates: true,
            },
        });
        if (!semester) {
            throw new common_1.NotFoundException(`Semester with ID ${id} not found`);
        }
        return semester;
    }
    async update(id, data) {
        return this.prisma.semester.update({
            where: { id },
            data: {
                name: data.name,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        });
    }
    async activate(id) {
        await this.prisma.semester.updateMany({
            where: { isActive: true },
            data: { isActive: false },
        });
        return this.prisma.semester.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async remove(id) {
        return this.prisma.semester.delete({
            where: { id },
        });
    }
};
exports.SemestersService = SemestersService;
exports.SemestersService = SemestersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SemestersService);
//# sourceMappingURL=semesters.service.js.map