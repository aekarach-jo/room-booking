import { AnnouncementsService } from './announcements.service';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    create(data: any, req: any): Promise<{
        creator: {
            id: string;
            username: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    }>;
    findAll(): Promise<({
        creator: {
            id: string;
            username: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    })[]>;
    findOne(id: string): Promise<{
        creator: {
            id: string;
            username: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    }>;
    pin(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.AnnouncementType;
        title: string;
        content: string;
        isPinned: boolean;
        publishDate: Date;
        expiryDate: Date | null;
        createdBy: string;
    }>;
}
