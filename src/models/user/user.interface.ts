import { Prisma } from '@prisma/client';
import Ajv from 'ajv';
import bcrypt from 'bcrypt';
import { prisma } from '@src/config';
import { Authentication } from '@models';
import {
  UserSchema,
  validateCreateUser,
  validateUpdateUser
} from './user.schema';
import dayjs from 'dayjs';

const ajv = new Ajv();

type UserOptions = {
  include?: Prisma.UserInclude;
};

export const getUserById = async <T extends UserOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const user = await prisma.user.findUnique({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    include: options?.include
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user as Prisma.UserGetPayload<T>;
};

export const getUsers = async <T extends UserOptions>(
  businessId: string,
  options?: T
) => {
  const users = await prisma.user.findMany({
    where: {
      businessId
    },
    include: options?.include
  });

  return users as Prisma.UserGetPayload<T>[];
};

type DoesUserExistInput =
  | {
      id?: undefined;
      email: string;
    }
  | {
      id: string;
      email?: undefined;
    };

export const doesUserExist = async (
  businessId: string,
  { id, email }: DoesUserExistInput
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      email,
      businessId
    }
  });

  return !!user;
};

export const createUser = async <T extends UserOptions>(
  businessId: string,
  data: UserSchema,
  options?: T
) => {
  const isValid = validateCreateUser(data);

  if (!isValid) {
    throw new Error(
      'Error creating user, ' + ajv.errorsText(validateCreateUser.errors)
    );
  }

  const userExists = await doesUserExist(businessId, { email: data.email });

  if (userExists) {
    throw new Error('A user already exists with that email');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: { ...data, businessId, password: hashedPassword },
    include: options?.include
  });

  return user as Prisma.UserGetPayload<T>;
};

export const updateUser = async <T extends UserOptions>(
  businessId: string,
  id: string,
  data: Partial<UserSchema>,
  options?: T
) => {
  const isValid = validateUpdateUser(data);

  if (!isValid) {
    throw new Error(
      'Error updating user, ' + ajv.errorsText(validateUpdateUser.errors)
    );
  }

  if (data.email) {
    const userExists = await doesUserExist(businessId, { email: data.email });

    if (userExists) {
      throw new Error('A user already exists with that email');
    }
  }

  const userExists = await doesUserExist(businessId, { id });

  if (!userExists) {
    throw new Error('User not found');
  }

  const user = await prisma.user.update({
    where: { id_businessId: { id, businessId } },
    data: {
      ...data,
      ...(data.password && { password: await bcrypt.hash(data.password, 12) }),
      businessId
    },
    include: options?.include
  });

  return user as Prisma.UserGetPayload<T>;
};

export const deleteUser = async <T extends UserOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const doesExist = await doesUserExist(businessId, { id });

  if (!doesExist) {
    throw new Error('User not found');
  }

  const user = await prisma.user.update({
    where: {
      id_businessId: {
        id,
        businessId
      }
    },
    data: {
      deletedAt: dayjs().utc().format()
    },
    include: options?.include
  });

  await Authentication.revokeTokens(user.id);

  return user as Prisma.UserGetPayload<T>;
};
