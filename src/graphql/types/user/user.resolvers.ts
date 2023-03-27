import { User, Business } from '@models';
import {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
  Resolvers
} from '@graphql/__generated__/graphql';

const getUser: QueryResolvers['getUser'] = async (
  _parent,
  { id },
  { businessId }
) => User.getUserById(businessId, id);

const getUsers: QueryResolvers['getUsers'] = async (
  _parent,
  _args,
  { businessId }
) => User.getUsers(businessId);

const createUser: MutationResolvers['createUser'] = async (
  _parent,
  { data },
  { businessId }
) => User.createUser(businessId, data);

const updateUser: MutationResolvers['updateUser'] = async (
  _parent,
  { id, data },
  { businessId }
) => User.updateUser(businessId, id, data);

const business: UserResolvers['business'] = async ({ businessId }) =>
  Business.getBusinessById(businessId);

const isActive: UserResolvers['isActive'] = async ({ deletedAt }) =>
  deletedAt === null;

export const resolvers: Resolvers = {
  Query: {
    getUser,
    getUsers
  },
  Mutation: {
    createUser,
    updateUser
  },
  User: {
    business,
    isActive
  }
};
