import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: UUID!
    firstName: String!
    lastName: String
    email: String!
    phoneNumber: String!
    business: Business!
    isActive: Boolean!
  }

  type Query {
    getUser(id: UUID!): User
    getUsers: [User!]!
  }

  type Mutation {
    createUser(data: CreateUserInput!): User
    updateUser(id: UUID!, data: UpdateUserInput!): User
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
