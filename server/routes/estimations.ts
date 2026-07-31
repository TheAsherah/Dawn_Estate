import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { hasAuthUser } from '../types.js';
import { sendServerError } from '../utils/errors.js';

export const estimationsRouter = Router();

estimationsRouter.post('/', async (req, res) => {
    try {
        const id = uuidv4();
        const { name, email, phone, propertyType, city, surface, message, images, videos } = req.body;

        const estimationModel = (prisma as any).estimationThread ?? (prisma as any).estimation;

        await estimationModel.create({
            data: {
                id,
                title: name || 'Estimation request',
                propertyDescription: [message, email, phone].filter(Boolean).join(' | '),
                approximateLocation: city || 'Unknown',
                propertyType: typeof propertyType === 'number' ? propertyType : null,
                status: 'open'
            }
        });

        res.json({ success: true, estimationId: id });
    } catch (error) {
        sendServerError(res, error);
    }
});

estimationsRouter.get('/', authenticateToken, async (req, res) => {
    try {
        if (!hasAuthUser(req)) return res.status(401).json({ error: 'Unauthorized' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin only' });
        }

        const estimationModel = (prisma as any).estimationThread ?? (prisma as any).estimation;

        const estimations = await estimationModel.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json({ estimations });
    } catch (error) {
        sendServerError(res, error);
    }
});
