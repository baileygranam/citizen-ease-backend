import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: String!
    firstName: String!
    lastName: String
    email: String!
    phoneNumber: String!
    business: Business!
    isActive: Boolean!
  }

  type Query {
    getUser(id: String!): User
    getUsers: [User!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
    updateUser(id: String!, data: UpdateUserInput!): User
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    password: String
  }
`;
