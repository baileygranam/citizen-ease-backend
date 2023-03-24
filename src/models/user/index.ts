import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
