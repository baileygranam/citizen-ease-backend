import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    email: String!
    phoneNumber: String!
    role: Role!
    business: Business!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }

  type Business {
    id: String!
    name: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }

  enum Role {
    ADMIN
    CLIENT
  }

  type Query {
    getUser(id: String!): User
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    password: String!
    role: Role!
    businessId: String!
  }
`;
