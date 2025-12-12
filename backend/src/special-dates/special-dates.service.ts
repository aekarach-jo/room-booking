import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpecialDatesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
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

  async findByMonth(month: number, year: number) {
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

  async findOne(id: string) {
    const specialDate = await this.prisma.specialDate.findUnique({
      where: { id },
      include: {
        semester: true,
      },
    });
    if (!specialDate) {
      throw new NotFoundException(`Special date with ID ${id} not found`);
    }
    return specialDate;
  }

  async update(id: string, data: any) {
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

  async remove(id: string) {
    return this.prisma.specialDate.delete({
      where: { id },
    });
  }
}
