import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    getProfile(user: JwtPayload): Promise<any>;
}
