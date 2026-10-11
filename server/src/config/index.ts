import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const rawJwtSecret = process.env.JWT_SECRET?.trim();

if (isProd && !rawJwtSecret) {
  throw new Error('FATAL: JWT_SECRET environment variable is required and cannot be empty in production mode.');
}

const jwtSecret = rawJwtSecret || (isProd ? '' : 'romefind-super-secret-jwt-key-change-in-production-2026');

// Validate JWT expiration string format (e.g. '7d', '24h', '3600s')
const rawExpiresIn = process.env.JWT_EXPIRES_IN?.trim() || '7d';
const validExpiresPattern = /^(\d+([smhdwy]?))$/i;
const jwtExpiresIn = validExpiresPattern.test(rawExpiresIn) ? rawExpiresIn : '7d';

// Default CORS origin: use production URL in production mode, localhost in development
const defaultCorsOrigin = isProd ? 'https://romefind.vercel.app' : 'http://localhost:5173';
const corsOrigin = process.env.CORS_ORIGIN?.trim() || defaultCorsOrigin;

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  jwtSecret,
  jwtExpiresIn,
  corsOrigin,
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db'
};


