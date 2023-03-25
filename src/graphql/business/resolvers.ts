import {
  Resolvers,
  QueryResolvers,
  MutationResolvers
} from '../__generated__/graphql';
import * as Business from '../../models/business';

const getBusiness: QueryResolvers['getBusiness'] = async (_parent, { id }) =>
  Business.getBusinessById(id);

const createBusiness: MutationResolvers['createBusiness'] = async (
  _parent,
  { data }
) => Business.createBusiness(data);

export const resolvers: Resolvers = {
  Query: {
    getBusiness
  },
  Mutation: {
    createBusiness
  }
};
