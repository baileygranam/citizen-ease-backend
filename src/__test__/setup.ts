import Prisma, { PrismaClient } from '@prisma/client';
import * as Factory from './factory';

export const prisma = new PrismaClient();

export type State = {
  business: Prisma.Business;
  user: Prisma.User;
  role: Prisma.Role;
  permissions: Prisma.Permission[];
};

export const setup = async (): Promise<State> => {
  const state = {} as unknown as State;

  const permissions = await prisma.permission.findMany();
  state.permissions = permissions;

  const business = await Factory.createBusiness();
  state.business = business;

  const role = await Factory.createRole(state);
  state.role = role;

  const user = await Factory.createUser(state);
  state.user = user;

  return state;
};
