import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecurringBookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    // Create recurring booking
    const recurringBooking = await this.prisma.recurringBooking.create({
      data: {
        userId,
        roomId: data.roomId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        pattern: data.pattern,
        daysOfWeek: data.daysOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
      },
    });

    // Generate individual bookings based on pattern
    await this.generateBookings(recurringBooking.id);

    return recurringBooking;
  }

  async generateBookings(recurringBookingId: string) {
    const recurring = await this.prisma.recurringBooking.findUnique({
      where: { id: recurringBookingId },
      include: { user: true },
    });

    if (!recurring) return;

    const bookings = [];
    const currentDate = new Date(recurring.startDate);
    const endDate = recurring.endDate ? new Date(recurring.endDate) : new Date(recurring.startDate.getTime() + 90 * 24 * 60 * 60 * 1000); // Default 90 days

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const shouldBook =
        recurring.pattern === 'DAILY' ||
        (recurring.pattern === 'WEEKLY' && (recurring.daysOfWeek as any)?.includes(dayOfWeek));

      if (shouldBook) {
        bookings.push({
          userId: recurring.userId,
          roomId: recurring.roomId,
          date: new Date(currentDate),
          startTime: new Date(`${currentDate.toISOString().split('T')[0]}T${recurring.startTime}`),
          endTime: new Date(`${currentDate.toISOString().split('T')[0]}T${recurring.endTime}`),
          purpose: recurring.purpose,
          attendees: 1,
          status: recurring.user.role === 'TEACHER' ? 'APPROVED' : 'PENDING',
          recurringBookingId: recurring.id,
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Batch create bookings
    if (bookings.length > 0) {
      await this.prisma.booking.createMany({
        data: bookings,
        skipDuplicates: true,
      });
    }

    return bookings.length;
  }

  async findAll(userId?: string) {
    return this.prisma.recurringBooking.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
          },
        },
        room: true,
        bookings: {
          take: 5,
          orderBy: {
            date: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const recurringBooking = await this.prisma.recurringBooking.findUnique({
      where: { id },
      include: {
        user: true,
        room: true,
        bookings: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });
    if (!recurringBooking) {
      throw new NotFoundException(`Recurring booking with ID ${id} not found`);
    }
    return recurringBooking;
  }

  async update(id: string, data: any) {
    return this.prisma.recurringBooking.update({
      where: { id },
      data: {
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        purpose: data.purpose,
      },
    });
  }

  async remove(id: string) {
    // Delete all future bookings
    await this.prisma.booking.deleteMany({
      where: {
        recurringBookingId: id,
        date: {
          gte: new Date(),
        },
      },
    });

    // Delete recurring booking
    return this.prisma.recurringBooking.delete({
      where: { id },
    });
  }
}
