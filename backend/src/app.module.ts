import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { SemestersModule } from './semesters/semesters.module';
import { SpecialDatesModule } from './special-dates/special-dates.module';
import { RecurringBookingsModule } from './recurring-bookings/recurring-bookings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    RoomsModule,
    BookingsModule,
    SemestersModule,
    SpecialDatesModule,
    RecurringBookingsModule,
    AnalyticsModule,
    NotificationsModule,
    AnnouncementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
