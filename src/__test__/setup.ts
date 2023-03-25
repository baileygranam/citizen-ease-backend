import Prisma, { PrismaClient } from '@prisma/client';
import { createBusiness, createUser } from './factory';

export const prisma = new PrismaClient();

export type State = {
  business: Prisma.Business;
  user: Prisma.User;
};

export const setup = async (): Promise<State> => {
  const state = {} as unknown as State;

  const business = await createBusiness();
  state.business = business;

  const user = await createUser(state);
  state.user = user;

  return state;
};
