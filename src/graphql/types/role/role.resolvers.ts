import { Role } from '@models';
import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  RoleResolvers
} from '@graphql/__generated__/graphql';
import { prisma } from '@src/config';

const getRole: QueryResolvers['getRole'] = async (
  _parent,
  { id },
  { businessId }
) => Role.getRoleById(businessId, id);

const getRoles: QueryResolvers['getRoles'] = async (
  _parent,
  _args,
  { businessId }
) => Role.getRoles(businessId);

const createRole: MutationResolvers['createRole'] = async (
  _parent,
  { data },
  { businessId }
) => Role.createRole(businessId, data);

const updateRole: MutationResolvers['updateRole'] = async (
  _parent,
  { id, data },
  { businessId }
) => Role.updateRole(businessId, id, data);

const deleteRole: MutationResolvers['deleteRole'] = async (
  _parent,
  { id },
  { businessId }
) => Role.deleteRole(businessId, id);

const permissions: RoleResolvers['permissions'] = async ({ id }) =>
  prisma.permission.findMany({ where: { roles: { some: { id } } } });

export const resolvers: Resolvers = {
  Query: {
    getRole,
    getRoles
  },
  Mutation: {
    createRole,
    updateRole,
    deleteRole
  },
  Role: {
    permissions
  }
};
