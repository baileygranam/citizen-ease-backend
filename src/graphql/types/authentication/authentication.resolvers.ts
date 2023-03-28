import { Authentication, User } from '@models';
import { prisma } from '@src/config';
import bcrypt from 'bcrypt';
import { Resolvers, MutationResolvers } from '@graphql/__generated__/graphql';
import { TokenType } from '@prisma/client';

const authenticate: MutationResolvers['authenticate'] = async (
  _parent,
  { email, password }
) => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new Error(`We couldn't find an account with that email.`);
  }

  if (user.deletedAt) {
    throw new Error('Access to this account has been disabled.');
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password);

  if (!doesPasswordMatch) {
    throw new Error('The email or password entered is incorrect.');
  }

  const tokens = await Authentication.createTokens(user);

  return tokens;
};

const refreshToken: MutationResolvers['refreshToken'] = async (
  _parent,
  { refreshToken }
) => {
  const isTokenValid = await Authentication.isTokenValid(
    refreshToken,
    TokenType.REFRESH
  );

  if (isTokenValid) {
    const { businessId, userId } = Authentication.getTokenPayload(
      refreshToken,
      TokenType.REFRESH
    );

    const user = await User.getUserById(businessId, userId);

    return Authentication.createToken(user, TokenType.ACCESS);
  }

  throw new Error('Invalid token');
};

const logout: MutationResolvers['logout'] = async (
  _parent,
  _args,
  { userId }
) => {
  await Authentication.revokeTokens(userId);
  return true;
};

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    authenticate,
    refreshToken,
    logout
  }
};
