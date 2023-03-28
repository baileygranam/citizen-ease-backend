import { User, Business, Role } from '@models';
import {
  Resolvers,
  BusinessResolvers,
  QueryResolvers,
  MutationResolvers
} from '@graphql/__generated__/graphql';

const getBusiness: QueryResolvers['getBusiness'] = async (
  _parent,
  _args,
  { businessId }
) => Business.getBusinessById(businessId);

const createBusiness: MutationResolvers['createBusiness'] = async (
  _parent,
  { data }
) => Business.createBusiness(data);

const users: BusinessResolvers['users'] = async ({ id: businessId }) =>
  User.getUsers(businessId);

const roles: BusinessResolvers['roles'] = async ({ id: businessId }) =>
  Role.getRoles(businessId);

export const resolvers: Resolvers = {
  Query: {
    getBusiness
  },
  Mutation: {
    createBusiness
  },
  Business: {
    users,
    roles
  }
};
