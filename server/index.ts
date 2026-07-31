import app from './app.js';
import prisma from './db.js';

const PORT = process.env.PORT || 3001;
const shouldStartServer = process.env.NODE_ENV !== 'test';

if (shouldStartServer) {
    const shutdown = async () => {
        await prisma.$disconnect();
        process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    app.listen(PORT, () => {
        console.log(`Dawn Estate Local Server running on http://localhost:${PORT}`);
    });
}

export { app };
