import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard-stats')
  async getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('booking-trend')
  async getBookingTrend(@Query('days') days?: string) {
    const numDays = days ? parseInt(days) : 7;
    return this.analyticsService.getBookingTrend(numDays);
  }

  @Get('room-utilization')
  async getRoomUtilization() {
    return this.analyticsService.getRoomUtilization();
  }

  @Get('peak-hours')
  async getPeakHours() {
    return this.analyticsService.getPeakHours();
  }

  @Get('booking-by-role')
  async getBookingByRole() {
    return this.analyticsService.getBookingByRole();
  }
}
