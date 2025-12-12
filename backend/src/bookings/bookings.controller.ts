import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from 'src/shared/enums/roles.enum';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser() user: JwtPayload) {
    return this.bookingsService.create(createBookingDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.bookingsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.bookingsService.findOne(id, user);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  approve(@Param('id') id: string) {
    return this.bookingsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  reject(@Param('id') id: string, @Body('adminNote') adminNote: string) {
    return this.bookingsService.reject(id, adminNote);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.bookingsService.cancel(id, user);
  }

  @Get('calendar/view')
  getCalendarView(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.bookingsService.getCalendarView(startDate, endDate);
  }

  @Post('batch-approve')
  @UseGuards(RolesGuard)
  @Roles(Role.STAFF)
  batchApprove(@Body('bookingIds') bookingIds: string[]) {
    return this.bookingsService.batchApprove(bookingIds);
  }

  @Post(':id/check-in')
  checkIn(@Param('id') id: string) {
    return this.bookingsService.checkIn(id);
  }

  @Post(':id/check-out')
  checkOut(@Param('id') id: string) {
    return this.bookingsService.checkOut(id);
  }
}
