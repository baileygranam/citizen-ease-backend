import { Prisma, PrismaClient } from '@prisma/client';
import Ajv from 'ajv';
import bcrypt from 'bcrypt';
import { validateCreateUser } from './schema';

const prisma = new PrismaClient();
const ajv = new Ajv();

type UserOptions = {
  include?: Prisma.UserInclude;
};

export const getUserById = async <T extends UserOptions>(
  businessId: string,
  id: string,
  options?: T
) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      businessId
    },
    include: options?.include
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user as Prisma.UserGetPayload<T>;
};

export const doesUserExist = async (businessId: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      businessId
    }
  });

  return !!user;
};

export const createUser = async <T extends UserOptions>(
  businessId: string,
  data: Prisma.UserUncheckedCreateInput,
  options?: T
) => {
  const isValid = validateCreateUser(data);
  if (!isValid) {
    throw new Error(
      'Error creating user' + ajv.errorsText(validateCreateUser.errors)
    );
  }

  const userExists = await doesUserExist(businessId, data.email);
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
