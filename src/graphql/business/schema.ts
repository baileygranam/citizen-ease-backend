import { gql } from 'apollo-server-express';

export const schema = gql`
  type Business {
    id: String!
    name: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String

    users: [User!]!
  }

  type Query {
    getBusiness(id: String!): Business
  }

  type Mutation {
    createBusiness(data: CreateBusinessInput!): Business
  }

  input CreateBusinessInput {
    name: String!
  }
`;
