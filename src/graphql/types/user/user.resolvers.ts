import { User, Role } from '@models';
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

const deleteUser: MutationResolvers['deleteUser'] = async (
  _parent,
  { id },
  { businessId }
) => User.deleteUser(businessId, id);

const role: UserResolvers['role'] = async ({ businessId, roleId }) =>
  Role.getRoleById(businessId, roleId);

const isActive: UserResolvers['isActive'] = async ({ deletedAt }) =>
  deletedAt === null;

export const resolvers: Resolvers = {
  Query: {
    getUser,
    getUsers
  },
  Mutation: {
    createUser,
    updateUser,
    deleteUser
  },
  User: {
    role,
    isActive
  }
};
