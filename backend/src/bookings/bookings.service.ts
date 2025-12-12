import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Prisma, Booking, BookingStatus, User } from '@prisma/client';
import { Role } from 'src/shared/enums/roles.enum';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto, user: { id: string, role: Role }): Promise<Booking> {
    const { roomId, date, startTime, endTime } = createBookingDto;

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (!room.isActive) {
      throw new ConflictException('Room is not available for booking');
    }

    // Check for double bookings - prevent overlapping time slots
    // Time overlap occurs when:
    // 1. New booking starts before existing ends AND new booking ends after existing starts
    // This catches all overlap scenarios including:
    //    - Exact same time
    //    - New booking starts during existing
    //    - New booking ends during existing
    //    - New booking completely contains existing
    //    - Existing completely contains new booking
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0); // Normalize to start of day for date comparison
    
    const nextDay = new Date(bookingDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        roomId,
        date: {
          gte: bookingDate,
          lt: nextDay,
        },
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED] },
        AND: [
          { startTime: { lt: newEndTime } },
          { endTime: { gt: newStartTime } },
        ],
      },
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (overlappingBookings.length > 0) {
      const conflictInfo = overlappingBookings[0];
      const conflictStart = new Date(conflictInfo.startTime).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const conflictEnd = new Date(conflictInfo.endTime).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      throw new ConflictException(
        `ห้องถูกจองไปแล้วในช่วงเวลา ${conflictStart} - ${conflictEnd} โดย ${conflictInfo.user.fullName}`
      );
    }

    const initialStatus = user.role === Role.TEACHER ? BookingStatus.APPROVED : BookingStatus.PENDING;

    return this.prisma.booking.create({
      data: {
        ...createBookingDto,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        userId: user.id,
        status: initialStatus,
      },
    });
  }

  async findAll(user: { id: string, role: Role }) {
    if (user.role === Role.STAFF || user.role === Role.DEPARTMENT_HEAD) {
      return this.prisma.booking.findMany({ include: { user: true, room: true } });
    }
    return this.prisma.booking.findMany({
      where: { userId: user.id },
      include: { room: true },
    });
  }

  async findOne(id: string, user: { id: string, role: Role }) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, room: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role !== Role.STAFF && user.role !== Role.DEPARTMENT_HEAD && booking.userId !== user.id) {
      throw new ForbiddenException('You are not allowed to view this booking');
    }

    return booking;
  }

  async approve(id: string) {
    await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.APPROVED },
    });
    return { message: 'Booking approved' };
  }

  async reject(id: string, adminNote?: string) {
    await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.REJECTED, adminNote },
    });
    return { message: 'Booking rejected' };
  }

  async getCalendarView(startDate: string, endDate: string) {
    return this.prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
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
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }

  async batchApprove(bookingIds: string[]) {
    await this.prisma.booking.updateMany({
      where: {
        id: { in: bookingIds },
        status: BookingStatus.PENDING,
      },
      data: {
        status: BookingStatus.APPROVED,
      },
    });
    return { message: `${bookingIds.length} bookings approved`, count: bookingIds.length };
  }

  async checkIn(id: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { checkInTime: new Date() },
    });
  }

  async checkOut(id: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { checkOutTime: new Date() },
    });
  }

  async cancel(id: string, user: { id: string, role: Role }) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (user.role !== Role.STAFF && booking.userId !== user.id) {
      throw new ForbiddenException('You are not allowed to cancel this booking');
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.APPROVED) {
        throw new ConflictException(`Cannot cancel a booking with status ${booking.status}`);
    }

    await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
    return { message: 'Booking cancelled' };
  }
}
