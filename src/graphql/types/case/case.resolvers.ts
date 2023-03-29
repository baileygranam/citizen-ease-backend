import { Case, Client, User } from '@models';
import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  CaseResolvers
} from '@graphql/__generated__/graphql';

const getCase: QueryResolvers['getCase'] = async (
  _parent,
  { id },
  { businessId }
) => Case.getCaseById(businessId, id);

const getCases: QueryResolvers['getCases'] = async (
  _parent,
  _args,
  { businessId }
) => Case.getCases(businessId);

const createCase: MutationResolvers['createCase'] = async (
  _parent,
  { data },
  { businessId }
) => Case.createCase(businessId, data);

const updateCase: MutationResolvers['updateCase'] = async (
  _parent,
  { id, data },
  { businessId }
) => Case.updateCase(businessId, id, data);

const deleteCase: MutationResolvers['deleteCase'] = async (
  _parent,
  { id },
  { businessId }
) => Case.deleteCase(businessId, id);

const client: CaseResolvers['client'] = async (
  { clientId },
  _args,
  { businessId }
) => Client.getClientById(businessId, clientId);

const user: CaseResolvers['user'] = async ({ userId }, _args, { businessId }) =>
  User.getUserById(businessId, userId);

export const resolvers: Resolvers = {
  Query: {
    getCase,
    getCases
  },
  Mutation: {
    createCase,
    updateCase,
    deleteCase
  },
  Case: {
    client,
    user
  }
};
