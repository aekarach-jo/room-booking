import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SemestersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
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

  async findOne(id: string) {
    const semester = await this.prisma.semester.findUnique({
      where: { id },
      include: {
        specialDates: true,
      },
    });
    if (!semester) {
      throw new NotFoundException(`Semester with ID ${id} not found`);
    }
    return semester;
  }

  async update(id: string, data: any) {
    return this.prisma.semester.update({
      where: { id },
      data: {
        name: data.name,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  async activate(id: string) {
    // Deactivate all other semesters first
    await this.prisma.semester.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Activate the specified semester
    return this.prisma.semester.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async remove(id: string) {
    return this.prisma.semester.delete({
      where: { id },
    });
  }
}
