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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialDatesController = void 0;
const common_1 = require("@nestjs/common");
const special_dates_service_1 = require("./special-dates.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_enum_1 = require("../shared/enums/roles.enum");
let SpecialDatesController = class SpecialDatesController {
    constructor(specialDatesService) {
        this.specialDatesService = specialDatesService;
    }
    async create(data) {
        return this.specialDatesService.create(data);
    }
    async findAll(month, year) {
        if (month && year) {
            return this.specialDatesService.findByMonth(parseInt(month), parseInt(year));
        }
        return this.specialDatesService.findAll();
    }
    async findOne(id) {
        return this.specialDatesService.findOne(id);
    }
    async update(id, data) {
        return this.specialDatesService.update(id, data);
    }
    async remove(id) {
        return this.specialDatesService.remove(id);
    }
};
exports.SpecialDatesController = SpecialDatesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpecialDatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpecialDatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialDatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpecialDatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpecialDatesController.prototype, "remove", null);
exports.SpecialDatesController = SpecialDatesController = __decorate([
    (0, common_1.Controller)('special-dates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [special_dates_service_1.SpecialDatesService])
], SpecialDatesController);
//# sourceMappingURL=special-dates.controller.js.map