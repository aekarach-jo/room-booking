import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RecurringBookingsService } from './recurring-bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../shared/enums/roles.enum';

@Controller('recurring-bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecurringBookingsController {
  constructor(
    private readonly recurringBookingsService: RecurringBookingsService,
  ) {}

  @Post()
  @Roles(Role.TEACHER, Role.STAFF)
  async create(@Body() data: any, @Request() req) {
    return this.recurringBookingsService.create(data, req.user.id);
  }

  @Get()
  async findAll(@Request() req) {
    const isStaff = req.user.role === Role.STAFF;
    return this.recurringBookingsService.findAll(isStaff ? undefined : req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recurringBookingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.STAFF)
  async update(@Param('id') id: string, @Body() data: any) {
    return this.recurringBookingsService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.STAFF)
  async remove(@Param('id') id: string) {
    return this.recurringBookingsService.remove(id);
  }
}
