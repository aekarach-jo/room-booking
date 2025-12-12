import { SemestersService } from './semesters.service';
export declare class SemestersController {
    private readonly semestersService;
    constructor(semestersService: SemestersService);
    create(data: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(): Promise<({
        specialDates: {
            name: string;
            id: string;
            date: Date;
            type: import(".prisma/client").$Enums.SpecialDateType;
            description: string | null;
            semesterId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    })[]>;
    findActive(): Promise<{
        specialDates: {
            name: string;
            id: string;
            date: Date;
            type: import(".prisma/client").$Enums.SpecialDateType;
            description: string | null;
            semesterId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    findOne(id: string): Promise<{
        specialDates: {
            name: string;
            id: string;
            date: Date;
            type: import(".prisma/client").$Enums.SpecialDateType;
            description: string | null;
            semesterId: string | null;
        }[];
    } & {
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    update(id: string, data: any): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    activate(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        isActive: boolean;
        createdAt: Date;
        startDate: Date;
        endDate: Date;
    }>;
}
