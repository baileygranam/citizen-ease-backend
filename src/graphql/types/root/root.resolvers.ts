import { resolvers as scalarResolvers } from 'graphql-scalars';
import { Resolvers } from '@graphql/__generated__/graphql';

export const resolvers: Resolvers = {
  ...scalarResolvers,
  Query: {},
  Mutation: {}
};
