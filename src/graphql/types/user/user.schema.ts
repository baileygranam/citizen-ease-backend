import { gql } from 'apollo-server-express';

export const schema = gql`
  type User {
    id: UUID!
    firstName: String!
    lastName: String
    email: String!
    phoneNumber: String!
    role: Role!
    isActive: Boolean!
  }

  type Query {
    getUser(id: UUID!): User! @authorization(permissions: ["read:user"])
    getUsers: [User!]! @authorization(permissions: ["read:user"])
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
      @authorization(permissions: ["create:user"])
    updateUser(id: UUID!, data: UpdateUserInput!): User!
      @authorization(permissions: ["update:user"])
    deleteUser(id: UUID!): User! @authorization(permissions: ["delete:user"])
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    password: String!
    roleId: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    password: String
    roleId: String
  }
`;
