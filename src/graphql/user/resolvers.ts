import * as User from '../../models/user';
import { ApolloContext } from '../../types';

import {
  MutationCreateUserArgs,
  MutationUpdateUserArgs,
  QueryGetUserArgs,
  Resolvers
} from '../__generated__/graphql';

const getUser = async (
  _parent: unknown,
  { id }: QueryGetUserArgs,
  { businessId }: ApolloContext
) => User.getUserById(businessId, id);

const createUser = async (
  _parent: unknown,
  { data }: MutationCreateUserArgs,
  { businessId }: ApolloContext
) => User.createUser(businessId, data);

const updateUser = async (
  _parent: unknown,
  { id, data }: MutationUpdateUserArgs,
  { businessId }: ApolloContext
) => User.updateUser(businessId, id, data);

export const resolvers: Resolvers = {
  Query: {
    getUser
  },
  Mutation: {
    createUser,
    updateUser
  }
};
