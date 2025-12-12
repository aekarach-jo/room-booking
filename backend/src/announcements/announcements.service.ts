import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, createdBy: string) {
    return this.prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'INFO',
        isPinned: data.isPinned || false,
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        createdBy,
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });
  }

  async findActive() {
    const now = new Date();
    return this.prisma.announcement.findMany({
      where: {
        publishDate: {
          lte: now,
        },
        OR: [
          { expiryDate: null },
          {
            expiryDate: {
              gte: now,
            },
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { publishDate: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            username: true,
          },
        },
      },
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }
    return announcement;
  }

  async update(id: string, data: any) {
    return this.prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        publishDate: data.publishDate ? new Date(data.publishDate) : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
    });
  }

  async togglePin(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    return this.prisma.announcement.update({
      where: { id },
      data: { isPinned: !announcement.isPinned },
    });
  }

  async remove(id: string) {
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
