import {
  Resolvers,
  BusinessResolvers,
  QueryResolvers,
  MutationResolvers
} from '../__generated__/graphql';
import * as Business from '../../models/business';
import * as User from '../../models/user';

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
