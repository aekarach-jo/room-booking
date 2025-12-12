import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto) {
    return this.prisma.room.create({ data: createRoomDto });
  }

  findAll() {
    return this.prisma.room.findMany();
  }

  findOne(id: string) {
    return this.prisma.room.findUnique({ where: { id } });
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  remove(id: string) {
    return this.prisma.room.delete({ where: { id } });
  }

  async getAvailableRooms(date: Date, startTime: Date, endTime: Date) {
    // Find rooms that do NOT have a booking that overlaps with the requested time
    const overlappingBookings = await this.prisma.booking.findMany({
      where: {
        AND: [
          { date: date },
          {
            OR: [
              { // Booking starts during the requested time
                startTime: { gte: startTime, lt: endTime }
              },
              { // Booking ends during the requested time
                endTime: { gt: startTime, lte: endTime }
              },
              { // Booking envelops the requested time
                startTime: { lte: startTime },
                endTime: { gte: endTime }
              }
            ]
          },
          {
            status: { in: ['APPROVED', 'PENDING'] }
          }
        ]
      },
      select: {
        roomId: true
      }
    });

    const unavailableRoomIds = overlappingBookings.map(b => b.roomId);

    return this.prisma.room.findMany({
      where: {
        id: {
          notIn: unavailableRoomIds,
        },
        isActive: true,
      },
    });
  }
}
