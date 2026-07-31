import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import type { AuthPayload } from '../types.js';

const parseCookies = (cookieHeader: string | undefined) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
        const [rawKey, ...rest] = part.trim().split('=');
        if (!rawKey) return acc;
        acc[rawKey] = decodeURIComponent(rest.join('='));
        return acc;
    }, {});
};

const getBearerToken = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer') return undefined;
    return token;
};

const getAuthToken = (req: Request) => {
    const bearer = getBearerToken(req);
    if (bearer) return bearer;
    const cookies = parseCookies(req.headers.cookie);
    return cookies['dawn-estate-token'];
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: 'JWT secret not configured' });

    jwt.verify(token, secret, (err, user) => {
        if (err || !user) return res.status(403).json({ error: 'Forbidden' });
        req.user = user as AuthPayload;
        next();
    });
};
