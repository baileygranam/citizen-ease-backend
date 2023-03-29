import { Case, Client } from '@models';
import {
  ClientResolvers,
  MutationResolvers,
  QueryResolvers,
  Resolvers
} from '@graphql/__generated__/graphql';

const getClient: QueryResolvers['getClient'] = async (
  _parent,
  { id },
  { businessId }
) => Client.getClientById(businessId, id);

const getClients: QueryResolvers['getClients'] = async (
  _parent,
  _args,
  { businessId }
) => Client.getClients(businessId);

const createClient: MutationResolvers['createClient'] = async (
  _parent,
  { data },
  { businessId }
) => Client.createClient(businessId, data);

const updateClient: MutationResolvers['updateClient'] = async (
  _parent,
  { id, data },
  { businessId }
) => Client.updateClient(businessId, id, data);

const terminateClient: MutationResolvers['terminateClient'] = async (
  _parent,
  { id },
  { businessId }
) => Client.terminateClient(businessId, id);

const isTerminated: ClientResolvers['isTerminated'] = async ({ deletedAt }) =>
  deletedAt !== null;

const cases: ClientResolvers['cases'] = async (
  { id: clientId },
  _args,
  { businessId }
) => Case.getCases(businessId, { filter: { clientId } });

export const resolvers: Resolvers = {
  Query: {
    getClient,
    getClients
  },
  Mutation: {
    createClient,
    updateClient,
    terminateClient
  },
  Client: {
    cases,
    isTerminated
  }
};
