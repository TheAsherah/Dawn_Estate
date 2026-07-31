import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

const prismaMock = vi.hoisted(() => ({
    user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn()
    },
    account: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn()
    },
    property: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn()
    },
    estimation: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn()
    },
    estimationThread: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn()
    },
    $disconnect: vi.fn(),
    $transaction: vi.fn()
}));

vi.mock('@prisma/client', () => ({
    PrismaClient: vi.fn(() => prismaMock),
    Prisma: {
        PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
            code?: string;
        }
    },
    PropertyCategory: {
        villa: 'villa',
        house: 'house',
        apartment: 'apartment',
        studio: 'studio',
        land: 'land'
    },
    PropertyPrestation: {
        sale: 'sale',
        rent: 'rent'
    },
    PropertyStatus: {
        pending: 'pending',
        approved: 'approved',
        rejected: 'rejected'
    }
}));

process.env.JWT_SECRET = 'test-secret';
process.env.GOOGLE_CLIENT_ID = 'google-client';
process.env.GOOGLE_CLIENT_SECRET = 'google-secret';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

import app from './app.js';

const makeToken = (payload: object) => jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

beforeEach(() => {
    Object.values(prismaMock.user).forEach(fn => fn.mockReset());
    Object.values(prismaMock.account).forEach(fn => fn.mockReset());
    Object.values(prismaMock.property).forEach(fn => fn.mockReset());
    Object.values(prismaMock.estimation).forEach(fn => fn.mockReset());
    Object.values(prismaMock.estimationThread).forEach(fn => fn.mockReset());
    prismaMock.$transaction.mockImplementation(async (callback: (tx: typeof prismaMock) => Promise<unknown>) => callback(prismaMock));
});

describe('Auth routes', () => {
    it('registers a user', async () => {
        prismaMock.user.create.mockResolvedValueOnce({ id: 'user-1' });

        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password', firstName: 'Test', lastName: 'User', phone: '123' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it('returns error on duplicate email', async () => {
        const KnownError = Prisma.PrismaClientKnownRequestError as unknown as new (message: string) => Prisma.PrismaClientKnownRequestError & { code?: string };
        const error = new KnownError('duplicate');
        error.code = 'P2002';
        prismaMock.user.create.mockRejectedValueOnce(error);

        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'dup@example.com', password: 'password', firstName: 'Dup', lastName: 'User' });

        expect(response.status).toBe(400);
    });

    it('logs in a user', async () => {
        const hashed = await bcrypt.hash('password', 10);
        prismaMock.user.findUnique.mockResolvedValueOnce({
            id: 'user-1',
            email: 'test@example.com',
            password: hashed,
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.accessToken).toBeTruthy();
    });

    it('maps an agent role from the stored role relation', async () => {
        const hashed = await bcrypt.hash('password', 10);
        prismaMock.user.findUnique.mockResolvedValueOnce({
            id: 'agent-1',
            email: 'agent@example.com',
            passwordHash: hashed,
            firstName: 'Agent',
            lastName: 'User',
            roleId: 3,
            role: { name: 'agent' }
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'agent@example.com', password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body.user.role).toBe('agent');
    });

    it('gets current user', async () => {
        prismaMock.user.findUnique.mockResolvedValueOnce({
            id: 'user-1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user'
        });

        const token = makeToken({ id: 'user-1', email: 'test@example.com', role: 'user' });
        const response = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe('test@example.com');
    });

    it('creates google account on callback', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ access_token: 'access', refresh_token: 'refresh', expires_in: 3600 })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    email: 'google@example.com',
                    given_name: 'Google',
                    family_name: 'User',
                    picture: 'https://example.com/avatar.png',
                    sub: 'google-sub'
                })
            });

        global.fetch = fetchMock as unknown as typeof fetch;

        const urlResponse = await request(app).get('/api/auth/google/url');
        const state = new URL(urlResponse.body.url).searchParams.get('state');

        prismaMock.user.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ id: 'user-1', email: 'google@example.com', role: 'user' });
        prismaMock.user.create.mockResolvedValueOnce({ id: 'user-1' });
        prismaMock.account.findUnique.mockResolvedValueOnce(null);
        prismaMock.account.create.mockResolvedValueOnce({ id: 'acc-1' });

        const response = await request(app).get(`/api/auth/callback/google?code=code&state=${state}`);

        expect(response.status).toBe(302);
        expect(response.header.location).toContain('auth=google');
        expect(prismaMock.account.create).toHaveBeenCalled();
    });

    it('updates google account on callback', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ access_token: 'access-2', refresh_token: 'refresh-2', expires_in: 3600 })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    email: 'google@example.com',
                    given_name: 'Google',
                    family_name: 'User',
                    picture: 'https://example.com/avatar.png',
                    sub: 'google-sub'
                })
            });

        global.fetch = fetchMock as unknown as typeof fetch;

        const urlResponse = await request(app).get('/api/auth/google/url');
        const state = new URL(urlResponse.body.url).searchParams.get('state');

        prismaMock.user.findUnique
            .mockResolvedValueOnce({ id: 'user-1', email: 'google@example.com', role: 'user' })
            .mockResolvedValueOnce({ id: 'user-1', email: 'google@example.com', role: 'user' });
        prismaMock.user.update.mockResolvedValueOnce({ id: 'user-1' });
        prismaMock.account.findUnique.mockResolvedValueOnce({ id: 'acc-1' });
        prismaMock.account.update.mockResolvedValueOnce({ id: 'acc-1' });

        const response = await request(app).get(`/api/auth/callback/google?code=code&state=${state}`);

        expect(response.status).toBe(302);
        expect(prismaMock.account.update).toHaveBeenCalled();
    });

    it('rejects unsupported upload file types', async () => {
        const token = makeToken({ id: 'user-1', email: 'test@example.com', role: 'user' });

        const response = await request(app)
            .post('/api/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('not-an-image'), {
                filename: 'malware.exe',
                contentType: 'application/x-msdownload'
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Unsupported');
    });
});

describe('Property routes', () => {
    it('lists properties with mapped price', async () => {
        prismaMock.property.findMany.mockResolvedValueOnce([
            { id: 'prop-1', price: '1200000.00' }
        ]);

        const response = await request(app).get('/api/properties');
        expect(response.status).toBe(200);
        expect(response.body.properties[0].price).toBe(1200000);
    });

    it('gets property by id', async () => {
        prismaMock.property.findUnique.mockResolvedValueOnce({ id: 'prop-1', price: '1000.00' });

        const response = await request(app).get('/api/properties/prop-1');
        expect(response.status).toBe(200);
        expect(response.body.property.id).toBe('prop-1');
    });

    it('filters properties by explicit status', async () => {
        prismaMock.property.findMany.mockResolvedValueOnce([
            {
                id: 'prop-1',
                title: 'Test property',
                description: 'desc',
                price: '1000.00',
                status: 'pending',
                address: 'Addr',
                city: 'Marrakech',
                specificAttributes: '{}',
                images: []
            }
        ]);

        const response = await request(app).get('/api/properties?status=pending');
        expect(response.status).toBe(200);
        expect(prismaMock.property.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({ status: 'pending' })
        }));
    });

    it('creates property for authenticated user', async () => {
        prismaMock.property.create.mockResolvedValueOnce({ id: 'prop-1' });

        const token = makeToken({ id: 'user-1', email: 'test@example.com', role: 'user' });
        const response = await request(app)
            .post('/api/properties')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'A', lastName: 'B', category: 'villa', prestation: 'sale', city: 'City', surface: 100, address: 'Addr', bedrooms: 2, bathrooms: 1, pool: false, price: 1000 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(prismaMock.property.create).toHaveBeenCalled();
    });

    it('accepts daily-renting category for authenticated users', async () => {
        prismaMock.property.create.mockResolvedValueOnce({ id: 'prop-2' });

        const token = makeToken({ id: 'user-1', email: 'test@example.com', role: 'user' });
        const response = await request(app)
            .post('/api/properties')
            .set('Authorization', `Bearer ${token}`)
            .send({ firstName: 'A', lastName: 'B', category: 'daily-renting', prestation: 'rent', city: 'Marrakech', surface: 90, address: 'Rue de la Kasbah', bedrooms: 2, bathrooms: 2, pool: false, price: 1500 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(prismaMock.property.create).toHaveBeenCalled();
    });

    it('updates property status for admin', async () => {
        prismaMock.property.update.mockResolvedValueOnce({ id: 'prop-1' });

        const token = makeToken({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
        const response = await request(app)
            .put('/api/properties/prop-1/status')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'approved' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('deletes property for owner', async () => {
        prismaMock.property.findUnique.mockResolvedValueOnce({ userId: 'user-1' });
        prismaMock.property.delete.mockResolvedValueOnce({ id: 'prop-1' });

        const token = makeToken({ id: 'user-1', email: 'test@example.com', role: 'user' });
        const response = await request(app)
            .delete('/api/properties/prop-1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});

describe('Estimation routes', () => {
    it('creates estimation', async () => {
        prismaMock.estimationThread.create.mockResolvedValueOnce({ id: 'est-1' });

        const response = await request(app)
            .post('/api/estimations')
            .send({ name: 'Test', email: 'test@example.com', phone: '123', propertyType: 'villa', city: 'City', surface: 120 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it('lists estimations for admin', async () => {
        prismaMock.estimationThread.findMany.mockResolvedValueOnce([{ id: 'est-1' }]);

        const token = makeToken({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
        const response = await request(app)
            .get('/api/estimations')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.estimations.length).toBe(1);
    });
});

describe('Admin routes', () => {
    it('returns admin stats', async () => {
        prismaMock.user.count.mockResolvedValueOnce(3);
        prismaMock.property.count.mockResolvedValueOnce(5);
        prismaMock.property.count.mockResolvedValueOnce(2);
        prismaMock.property.count.mockResolvedValueOnce(3);
        prismaMock.estimationThread.count.mockResolvedValueOnce(4);

        const token = makeToken({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
        const response = await request(app)
            .get('/api/admin/stats')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.stats.totalUsers).toBe(3);
    });

    it('returns admin users', async () => {
        prismaMock.user.findMany.mockResolvedValueOnce([{ id: 'user-1', email: 'test@example.com' }]);

        const token = makeToken({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
        const response = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(1);
    });
});
