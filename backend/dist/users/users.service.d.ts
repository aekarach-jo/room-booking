import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(username: string): Promise<User | undefined>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    deleteUser(id: string): Promise<User>;
}
