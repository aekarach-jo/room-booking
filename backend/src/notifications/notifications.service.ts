import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
