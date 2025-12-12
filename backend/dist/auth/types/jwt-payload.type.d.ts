import { Role } from 'src/shared/enums/roles.enum';
export type JwtPayload = {
    id: string;
    username: string;
    role: Role;
};
