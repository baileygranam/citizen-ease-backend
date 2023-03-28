import { gql } from 'apollo-server-express';

export const schema = gql`
  type Business {
    id: UUID!
    name: String!

    clients: [Client!]!
    users: [User!]! @authorization(permissions: ["read:user"])
    roles: [Role!]!
  }

  type Query {
    getBusiness: Business!
  }

  type Mutation {
    createBusiness(data: CreateBusinessInput!): Business!
    updateBusiness(data: UpdateBusinessInput!): Business!
  }

  input CreateBusinessInput {
    name: String!
  }

  input UpdateBusinessInput {
    name: String
  }
`;
