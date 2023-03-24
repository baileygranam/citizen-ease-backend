import { getUserById } from '../../models/user';
import { ApolloContext } from '../../types';

import { QueryGetUserArgs, Resolvers } from '../__generated__/graphql';

const getUser = async (
  _parent: unknown,
  { id }: QueryGetUserArgs,
  { businessId }: ApolloContext
) => getUserById(businessId, id);

export const resolvers: Resolvers = {
  Query: {
    getUser
  },
  Mutation: {}
};
