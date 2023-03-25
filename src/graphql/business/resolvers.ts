import {
  Resolvers,
  QueryGetBusinessArgs,
  MutationCreateBusinessArgs
} from '../__generated__/graphql';
import * as Business from '../../models/business';

const getBusiness = async (_parent: unknown, { id }: QueryGetBusinessArgs) =>
  Business.getBusinessById(id);

const createBusiness = async (
  _parent: unknown,
  { data }: MutationCreateBusinessArgs
) => Business.createBusiness(data);

export const resolvers: Resolvers = {
  Query: {
    getBusiness
  },
  Mutation: {
    createBusiness
  }
};
