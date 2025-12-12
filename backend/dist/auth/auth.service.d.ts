import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        username: string;
        fullName: string;
        studentId: string | null;
        teacherId: string | null;
        department: string | null;
        year: number | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        noShowCount: number;
        isSuspended: boolean;
        suspendedUntil: Date | null;
        createdAt: Date;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    validateUser(username: string): Promise<any>;
}
