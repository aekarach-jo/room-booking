import { SpecialDatesService } from './special-dates.service';
export declare class SpecialDatesController {
    private readonly specialDatesService;
    constructor(specialDatesService: SpecialDatesService);
    create(data: any): Promise<{
        name: string;
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.SpecialDateType;
        description: string | null;
        semesterId: string | null;
    }>;
    findAll(month?: string, year?: string): Promise<({
        semester: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            startDate: Date;
            endDate: Date;
        };
    } & {
        name: string;
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.SpecialDateType;
        description: string | null;
        semesterId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        semester: {
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            startDate: Date;
            endDate: Date;
        };
    } & {
        name: string;
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.SpecialDateType;
        description: string | null;
        semesterId: string | null;
    }>;
    update(id: string, data: any): Promise<{
        name: string;
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.SpecialDateType;
        description: string | null;
        semesterId: string | null;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: string;
        date: Date;
        type: import(".prisma/client").$Enums.SpecialDateType;
        description: string | null;
        semesterId: string | null;
    }>;
}
