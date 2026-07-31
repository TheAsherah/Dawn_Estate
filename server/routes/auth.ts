import { Router, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { getUserRoleFromRoleId, hasAuthUser, type UserRole } from '../types.js';
import { sendServerError } from '../utils/errors.js';

export const authRouter = Router();

const signToken = (payload: { id: string; email: string; role: UserRole }) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret not configured');
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const isValidUserRole = (value: string): value is UserRole =>
    value === 'admin' || value === 'agent' || value === 'client' || value === 'user';

const resolveUserRole = (roleId?: number | null, roleName?: string | null): UserRole => {
    if (roleName && isValidUserRole(roleName)) {
        return roleName;
    }
    return getUserRoleFromRoleId(roleId);
};

const isUniqueError = (error: unknown) =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

const getEncryptionKey = () => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) return undefined;
    if (!/^[0-9a-fA-F]{64}$/.test(secret)) return undefined;
    return Buffer.from(secret, 'hex');
};

const encryptToken = (value: string) => {
    const key = getEncryptionKey();
    if (!key) return value;
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
};

const decryptToken = (value?: string | null) => {
    if (!value) return null;
    const key = getEncryptionKey();
    if (!key) return value;
    const [ivHex, tagHex, payloadHex] = value.split(':');
    if (!ivHex || !tagHex || !payloadHex) return null;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(payloadHex, 'hex');
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};

const setAuthCookie = (res: Response, token: string) => {
    res.cookie('dawn-estate-token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    });
};

const getFrontendBaseUrl = () => process.env.NEXTAUTH_URL || 'http://localhost:3000';

const getGoogleConfig = () => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${getFrontendBaseUrl()}/api/auth/callback/google`;
    if (!clientId || !clientSecret) {
        throw new Error('Google OAuth not configured');
    }
    return { clientId, clientSecret, redirectUri };
};

const oauthStates = new Map<string, number>();
const oauthStateTtlMs = 10 * 60 * 1000;

const isStateValid = (state: string) => {
    const timestamp = oauthStates.get(state);
    if (!timestamp) return false;
    if (Date.now() - timestamp > oauthStateTtlMs) {
        oauthStates.delete(state);
        return false;
    }
    oauthStates.delete(state);
    return true;
};

const upsertGoogleAccount = async (userId: string, providerAccountId: string | null, accessToken: string | null, refreshToken: string | null, expiresAt: number | null) => {
    const accountModel = (prisma as any).account;
    if (!accountModel) {
        return null;
    }

    const encryptedAccessToken = accessToken ? encryptToken(accessToken) : null;
    const encryptedRefreshToken = refreshToken ? encryptToken(refreshToken) : null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
        try {
            return await prisma.$transaction(async (tx) => {
                const txAny = tx as any;
                const existing = await txAny.account.findUnique({
                    where: { userId_provider: { userId, provider: 'google' } }
                });

                if (existing) {
                    return txAny.account.update({
                        where: { id: existing.id },
                        data: {
                            providerAccountId,
                            accessToken: encryptedAccessToken,
                            refreshToken: encryptedRefreshToken,
                            expiresAt
                        }
                    });
                }

                return txAny.account.create({
                    data: {
                        id: uuidv4(),
                        userId,
                        provider: 'google',
                        providerAccountId,
                        accessToken: encryptedAccessToken,
                        refreshToken: encryptedRefreshToken,
                        expiresAt
                    }
                });
            });
        } catch (error) {
            const isUniqueConflict =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
            if (!isUniqueConflict || attempt === maxRetries) {
                throw error;
            }
        }
    }
};

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const id = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                id,
                email,
                passwordHash: hashedPassword,
                firstName,
                lastName,
                phone: phone || null,
                roleId: 3
            }
        });

        res.json({
            success: true,
            user: { id, email, firstName, lastName, role: 'user' }
        });
    } catch (error) {
        if (isUniqueError(error)) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        sendServerError(res, error);
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    select: { name: true }
                }
            }
        });
    const passwordHash = (user as { passwordHash?: string; password?: string } | null)?.passwordHash ?? (user as { passwordHash?: string; password?: string } | null)?.password;

        if (!user || !passwordHash || !(await bcrypt.compare(password, passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const role = resolveUserRole(user.roleId, user.role?.name);
        const accessToken = signToken({ id: user.id, email: user.email, role });
        setAuthCookie(res, accessToken);

        res.json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role,
                avatarUrl: null
            }
        });
    } catch (error) {
        sendServerError(res, error);
    }
});

authRouter.get('/google/url', async (req, res) => {
    try {
        const { clientId, redirectUri } = getGoogleConfig();
        const state = uuidv4();
        oauthStates.set(state, Date.now());
        const scope = encodeURIComponent('openid email profile https://www.googleapis.com/auth/calendar.readonly');
        const url =
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code&scope=${scope}` +
            `&access_type=offline&prompt=consent&state=${state}`;

        res.json({ url });
    } catch (error) {
        sendServerError(res, error);
    }
});

authRouter.get('/callback/google', async (req, res) => {
    try {
        const code = typeof req.query.code === 'string' ? req.query.code : undefined;
        const state = typeof req.query.state === 'string' ? req.query.state : undefined;
        const errorDescription = typeof req.query.error === 'string' ? req.query.error : undefined;

        if (errorDescription) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=${encodeURIComponent(errorDescription)}`);
        }
        if (!code || !state || !isStateValid(state)) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=invalid_state`);
        }

        const { clientId, clientSecret, redirectUri } = getGoogleConfig();
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        if (!tokenResponse.ok) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=token_exchange_failed`);
        }

        const tokenPayload = await tokenResponse.json();
        const accessToken = typeof tokenPayload.access_token === 'string' ? tokenPayload.access_token : null;
        const refreshToken = typeof tokenPayload.refresh_token === 'string' ? tokenPayload.refresh_token : null;
        const expiresIn = typeof tokenPayload.expires_in === 'number' ? tokenPayload.expires_in : null;
        const expiresAt = expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : null;

        if (!accessToken) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=missing_access_token`);
        }

        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!userInfoResponse.ok) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=userinfo_failed`);
        }

        const userInfo = await userInfoResponse.json();
        const email = typeof userInfo.email === 'string' ? userInfo.email : null;
        const firstName = typeof userInfo.given_name === 'string' ? userInfo.given_name : 'Google';
        const lastName = typeof userInfo.family_name === 'string' ? userInfo.family_name : 'User';
        const avatarUrl = typeof userInfo.picture === 'string' ? userInfo.picture : null;
        const providerAccountId = typeof userInfo.sub === 'string' ? userInfo.sub : null;

        if (!email) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=missing_email`);
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        let userId = existingUser?.id;

        if (!userId) {
            const newUserId = uuidv4();
            const randomPassword = await bcrypt.hash(uuidv4(), 10);
            await prisma.user.create({
                data: {
                    id: newUserId,
                    email,
                    passwordHash: randomPassword,
                    firstName,
                    lastName,
                    roleId: 3
                }
            });
            userId = newUserId;
        } else {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    firstName,
                    lastName
                }
            });
        }

        await upsertGoogleAccount(userId, providerAccountId, accessToken, refreshToken, expiresAt);

        const sessionUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, roleId: true, role: { select: { name: true } } }
        });

        if (!sessionUser) {
            return res.redirect(`${getFrontendBaseUrl()}/?auth_error=user_not_found`);
        }

        const jwtToken = signToken({
            id: sessionUser.id,
            email: sessionUser.email,
            role: resolveUserRole(sessionUser.roleId, sessionUser.role?.name)
        });
        setAuthCookie(res, jwtToken);

        return res.redirect(`${getFrontendBaseUrl()}/?auth=google`);
    } catch (error) {
        sendServerError(res, error);
    }
});

authRouter.get('/me', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.user;
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, roleId: true, role: { select: { name: true } } }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        const role = resolveUserRole(user.roleId, user.role?.name);
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role,
                avatarUrl: null
            }
        });
    } catch (error) {
        sendServerError(res, error);
    }
});

authRouter.get('/session', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, firstName: true, lastName: true, roleId: true, role: { select: { name: true } } }
        });

        const accountModel = (prisma as any).account;
        const account = accountModel
            ? await accountModel.findUnique({
                where: { userId_provider: { userId: req.user.id, provider: 'google' } }
            })
            : null;

        res.json({
            user: user
                ? {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: resolveUserRole(user.roleId, user.role?.name),
                    avatarUrl: null
                }
                : null,
            tokens: account
                ? {
                      accessToken: decryptToken(account.accessToken),
                      refreshToken: decryptToken(account.refreshToken),
                      expiresAt: account.expiresAt
                  }
                : null
        });
    } catch (error) {
        sendServerError(res, error);
    }
});

authRouter.post('/logout', async (req, res) => {
    res.clearCookie('dawn-estate-token', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    res.json({ success: true });
});
