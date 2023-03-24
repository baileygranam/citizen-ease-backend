import { gql } from 'apollo-server-express';

export default gql`
  type Business {
    id: String!
    name: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    deletedAt: DateTime
  }

  type Query {
    getBusiness(id: String!): Business
  }

  type Mutation {
    createBusiness(data: CreateBusinessInput): Business
  }

  input CreateBusinessInput {
    name: String!
  }
`;
