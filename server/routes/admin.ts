import { Router } from 'express';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { getUserRoleFromRoleId, hasAuthUser } from '../types.js';
import { sendServerError } from '../utils/errors.js';

export const adminRouter = Router();

adminRouter.get('/stats', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const [users, properties, pending, approved, estimations] = await Promise.all([
            prisma.user.count(),
            prisma.property.count(),
            prisma.property.count({ where: { status: 'pending' } }),
            prisma.property.count({ where: { status: 'approved' } }),
            prisma.estimationThread.count()
        ]);

        res.json({
            stats: {
                totalUsers: users,
                totalProperties: properties,
                pendingProperties: pending,
                approvedProperties: approved,
                totalEstimations: estimations
            }
        });
    } catch (error) {
        sendServerError(res, error);
    }
});

adminRouter.get('/users', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }
        const users = await prisma.user.findMany({
            select: { id: true, email: true, firstName: true, lastName: true, roleId: true, createdAt: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            users: users.map((user) => ({
                ...user,
                role: getUserRoleFromRoleId(user.roleId)
            }))
        });
    } catch (error) {
        sendServerError(res, error);
    }
});
