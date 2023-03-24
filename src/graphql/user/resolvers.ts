import * as UserModel from '../../models/user';
import { ApolloContext } from '../../types';

import {
  MutationCreateUserArgs,
  QueryGetUserArgs,
  Resolvers
} from '../__generated__/graphql';

const getUser = async (
  _parent: unknown,
  { id }: QueryGetUserArgs,
  { businessId }: ApolloContext
) => UserModel.getUserById(businessId, id);

const createUser = async (
  _parent: unknown,
  { data }: MutationCreateUserArgs,
  { businessId }: ApolloContext
) => UserModel.createUser(businessId, data);

export const resolvers: Resolvers = {
  Query: {
    getUser
  },
  Mutation: {
    createUser
  }
};
