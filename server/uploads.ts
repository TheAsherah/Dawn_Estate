import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime'
]);
const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.mov']);
const maxFileSize = 25 * 1024 * 1024;

export const createUpload = () => {
    const publicDir = path.join(__dirname, '..', 'public');
    const uploadsDir = path.join(publicDir, 'uploads');

    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        }
    });

    const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const isAllowedMime = allowedMimeTypes.has(file.mimetype);
        const isAllowedExtension = allowedExtensions.has(ext);

        if (!isAllowedMime || !isAllowedExtension) {
            cb(new Error('Unsupported file type. Please upload images or videos only.'));
            return;
        }

        cb(null, true);
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: maxFileSize }
    });

    return { upload, uploadsDir };
};
