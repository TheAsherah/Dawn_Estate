import type { Request } from 'express';

export type UserRole = 'user' | 'client' | 'admin' | 'agent';

export const getUserRoleFromRoleId = (roleId?: number | null): UserRole => {
    if (roleId === 1) return 'admin';
    if (roleId === 2) return 'agent';
    if (roleId === 3) return 'user';
    return 'user';
};

export type AuthPayload = {
    id: string;
    email: string;
    role: UserRole;
};

export type AuthenticatedRequest = Request & {
    user: AuthPayload;
};

export const hasAuthUser = (req: Request): req is AuthenticatedRequest => Boolean(req.user);

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}
