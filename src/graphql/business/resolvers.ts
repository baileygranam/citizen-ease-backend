import { User, Business } from '@models';
import {
  Resolvers,
  BusinessResolvers,
  QueryResolvers,
  MutationResolvers
} from '@graphql/__generated__/graphql';

const getBusiness: QueryResolvers['getBusiness'] = async (_parent, { id }) =>
  Business.getBusinessById(id);

const createBusiness: MutationResolvers['createBusiness'] = async (
  _parent,
  { data }
) => Business.createBusiness(data);

const users: BusinessResolvers['users'] = async ({ id }) => User.getUsers(id);

export const resolvers: Resolvers = {
  Query: {
    getBusiness
  },
  Mutation: {
    createBusiness
  },
  Business: {
    users
  }
};
