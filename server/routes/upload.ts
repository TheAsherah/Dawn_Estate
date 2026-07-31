import { Router } from 'express';
import type { Multer } from 'multer';
import { authenticateToken } from '../middleware/auth.js';

export const createUploadRouter = (upload: Multer) => {
    const uploadRouter = Router();

    uploadRouter.post('/', authenticateToken, (req, res) => {
        upload.single('file')(req, res, (error) => {
            if (error) {
                return res.status(400).json({ error: error.message || 'Upload failed' });
            }

            if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

            const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            res.json({
                success: true,
                url: fileUrl,
                path: `/uploads/${req.file.filename}`
            });
        });
    });

    return uploadRouter;
};
