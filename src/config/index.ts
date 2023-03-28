import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();

const {
  INTROSPECTION_ENABLED = 'false',
  JWT_SECRET = '',
  JWT_REFRESH_SECRET = '',
  JWT_ACCESS_EXPIRATION_MINUTES = '15',
  JWT_REFRESH_EXPIRATION_DAYS = '7'
} = process.env;

export default {
  INTROSPECTION_ENABLED: JSON.parse(INTROSPECTION_ENABLED) as boolean,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES: parseInt(JWT_ACCESS_EXPIRATION_MINUTES, 10),
  JWT_REFRESH_EXPIRATION_DAYS: parseInt(JWT_REFRESH_EXPIRATION_DAYS, 10)
};
