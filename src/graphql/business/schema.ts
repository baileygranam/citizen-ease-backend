import { gql } from 'apollo-server-express';

export const schema = gql`
  type Business {
    id: UUID!
    name: String!

    users: [User!]!
  }

  type Query {
    getBusiness(id: UUID!): Business
  }

  type Mutation {
    createBusiness(data: CreateBusinessInput!): Business
  }

  input CreateBusinessInput {
    name: String!
  }
`;
