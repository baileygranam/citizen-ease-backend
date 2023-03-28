import { gql } from 'apollo-server-express';

export const schema = gql`
  type Business {
    id: UUID!
    name: String!

    users: [User!]!
    roles: [Role!]!
  }

  type Query {
    getBusiness: Business!
  }

  type Mutation {
    createBusiness(data: CreateBusinessInput!): Business!
  }

  input CreateBusinessInput {
    name: String!
  }
`;