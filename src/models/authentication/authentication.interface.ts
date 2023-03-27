import { PrismaClient, TokenType, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';
import config from '@src/config';

dayjs.extend(utcPlugin);

const prisma = new PrismaClient();

interface AuthenticationJwtPayload extends jwt.JwtPayload {
  businessId: string;
  userId: string;
}

export const isAuthenticationPayload = (
  payload: jwt.JwtPayload | string
): payload is AuthenticationJwtPayload => {
  return (
    typeof payload === 'object' &&
    'userId' in payload &&
    'businessId' in payload
  );
};

export const createToken = async (user: User, type: TokenType) => {
  try {
    const expiration =
      type === TokenType.ACCESS
        ? config.JWT_ACCESS_EXPIRATION_MINUTES
        : config.JWT_REFRESH_EXPIRATION_DAYS;

    const { id: userId, businessId } = user;

    const token = jwt.sign({ userId, businessId }, config.JWT_SECRET, {
      expiresIn: `${expiration}m`
    });

    await prisma.token.create({
      data: {
        type,
        token,
        expiresAt: dayjs().utc().add(expiration, 'minutes').format(),
        userId
      }
    });

    return token;
  } catch (_error) {
    throw new Error('Error creating token');
  }
};

export const createTokens = async (user: User) => {
  return {
    accessToken: await createToken(user, TokenType.ACCESS),
    refreshToken: await createToken(user, TokenType.REFRESH)
  };
};

export const revokeTokens = async (userId: string) => {
  await prisma.token.updateMany({
    where: {
      userId
    },
    data: {
      deletedAt: dayjs().utc().format()
    }
  });
};

export const isTokenValid = async (_token: string, type: TokenType) => {
  try {
    const payload = jwt.verify(_token, config.JWT_SECRET);

    if (!isAuthenticationPayload(payload)) {
      return false;
    }

    const token = await prisma.token.findFirst({
      where: {
        userId: payload.userId,
        token: _token,
        type
      }
    });

    const expiresAt = token?.expiresAt;
    const hasExpired = expiresAt ? dayjs(expiresAt).isBefore(dayjs()) : false;

    if (!token || token.deletedAt || hasExpired) {
      return false;
    }
  } catch (_error) {
    return false;
  }

  return true;
};

export const getTokenPayload = (token: string) => {
  const payload = jwt.verify(token, config.JWT_SECRET);

  if (!isAuthenticationPayload(payload)) {
    throw new Error('Invalid token');
  }

  return payload;
};
