import { PrismaService } from '../prisma/prisma.service';
export declare class AnnouncementsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: any, createdBy: string): Promise<{
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
    findActive(): Promise<({
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
    togglePin(id: string): Promise<{
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
