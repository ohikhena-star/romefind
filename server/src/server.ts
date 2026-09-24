import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/index.js';
import { apiRouter } from './routes.js';
import { errorHandler } from './middleware/error.middleware.js';

export const app = express();

// Middlewares
app.use(cors({
  origin: config.corsOrigin || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test' && !process.env.TESTING) {
  app.use(morgan('dev'));
}

// Mount API routes (supports both standalone Express /api and Vercel serverless functions)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Error Handling Middleware
app.use(errorHandler);

const PORT = config.port || 4000;

const isMainEntry = process.argv[1] && (
  process.argv[1].endsWith('server.ts') || 
  process.argv[1].endsWith('server.js') || 
  process.argv[1].includes('server')
) && !process.argv[1].includes('test');

if (isMainEntry && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 ROMEfind Backend & Intelligence API running on http://localhost:${PORT}`);
    console.log(`🌐 Health check at http://localhost:${PORT}/api/health`);
  });
}

export default app;
