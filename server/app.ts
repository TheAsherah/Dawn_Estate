import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { authRouter } from './routes/auth.js';
import { propertiesRouter } from './routes/properties.js';
import { estimationsRouter } from './routes/estimations.js';
import { adminRouter } from './routes/admin.js';
import { createUploadRouter } from './routes/upload.js';
import { healthRouter } from './routes/health.js';
import { createUpload } from './uploads.js';

dotenv.config();

const app = express();

const frontendUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(cors({ origin: [frontendUrl], credentials: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.headers.host}${req.originalUrl}`);
  }
  return next();
});

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; img-src 'self' https: data:; connect-src 'self' https://oauth2.googleapis.com https://www.googleapis.com; script-src 'self' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; frame-src https://accounts.google.com"
  );
  next();
});

const { upload, uploadsDir } = createUpload();
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRouter);
app.use('/api/properties', propertiesRouter);
app.use('/api/estimations', estimationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', createUploadRouter(upload));
app.use('/api/health', healthRouter);

export default app;
