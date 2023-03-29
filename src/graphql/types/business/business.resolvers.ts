import { Client, User, Business, Role, Case } from '@models';
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

const updateBusiness: MutationResolvers['updateBusiness'] = async (
  _parent,
  { data },
  { businessId }
) => Business.updateBusiness(businessId, data);

const cases: BusinessResolvers['cases'] = async ({ id: businessId }) =>
  Case.getCases(businessId);

const clients: BusinessResolvers['clients'] = async ({ id: businessId }) =>
  Client.getClients(businessId);

const users: BusinessResolvers['users'] = async ({ id: businessId }) =>
  User.getUsers(businessId);

const roles: BusinessResolvers['roles'] = async ({ id: businessId }) =>
  Role.getRoles(businessId);

export const resolvers: Resolvers = {
  Query: {
    getBusiness
  },
  Mutation: {
    createBusiness,
    updateBusiness
  },
  Business: {
    cases,
    clients,
    users,
    roles
  }
};
