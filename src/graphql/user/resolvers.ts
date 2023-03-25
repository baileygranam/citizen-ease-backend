import * as User from '../../models/user';
import * as Business from '../../models/business';

import {
  MutationResolvers,
  QueryResolvers,
  UserResolvers,
  Resolvers
} from '../__generated__/graphql';

const getUser: QueryResolvers['getUser'] = async (
  _parent,
  { id },
  { businessId }
) => User.getUserById(businessId, id);

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

export const resolvers: Resolvers = {
  Query: {
    getUser
  },
  Mutation: {
    createUser,
    updateUser
  },
  User: {
    business: business
  }
};
