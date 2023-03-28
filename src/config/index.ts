import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();

const {
  NODE_ENV = '',
  JWT_SECRET = '',
  JWT_REFRESH_SECRET = '',
  JWT_ACCESS_EXPIRATION_MINUTES = '15',
  JWT_REFRESH_EXPIRATION_DAYS = '7'
} = process.env;

export default {
  NODE_ENV,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES: parseInt(JWT_ACCESS_EXPIRATION_MINUTES, 10),
  JWT_REFRESH_EXPIRATION_DAYS: parseInt(JWT_REFRESH_EXPIRATION_DAYS, 10)
};
