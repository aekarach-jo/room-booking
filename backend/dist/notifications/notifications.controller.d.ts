import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        isRead: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        isRead: boolean;
    }>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        message: string;
        isRead: boolean;
    }>;
}
