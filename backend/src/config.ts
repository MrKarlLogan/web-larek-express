import dotenv from 'dotenv';
import { CookieOptions } from 'express';
import ms from 'ms';

dotenv.config();

export const PORT = process.env.PORT || '4200';
export const ORIGIN_ALLOW = process.env.ORIGIN_ALLOW || 'http://localhost:5173';
export const DB_ADDRESS = process.env.DB_ADDRESS || 'mongodb://127.0.0.1:27017/weblarek';
export const UPLOAD_PATH = process.env.UPLOAD_PATH || 'images';
export const UPLOAD_PATH_TEMP = process.env.UPLOAD_PATH_TEMP || 'temp';

export const ACCESS_TOKEN = {
  secret: process.env.AUTH_ACCESS_TOKEN_SECRET || 'secret-dev',
  expiry: process.env.AUTH_ACCESS_TOKEN_EXPIRY || '1m',
};

export const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET || 'secret-dev',
  expiry: process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d',
  cookie: {
    name: 'refreshToken',
    options: {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: false,
      maxAge: ms((process.env.AUTH_REFRESH_TOKEN_EXPIRY || '7d') as ms.StringValue),
      path: '/',
    } as CookieOptions,
  },
};
