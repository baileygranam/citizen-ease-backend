import { gql } from 'apollo-server-express';

export const schema = gql`
  type Role {
    id: UUID!
    name: String!

    permissions: [Permission!]!
  }

  type Permission {
    id: UUID!
    name: String!
    description: String!
  }

  type Query {
    getRole(id: UUID!): Role!
    getRoles: [Role!]!
  }

  type Mutation {
    createRole(data: CreateRoleInput!): Role!
    updateRole(id: UUID!, data: UpdateRoleInput!): Role!
    deleteRole(id: UUID!): Role!
  }

  input CreateRoleInput {
    name: String!
    permissionIds: [String!]!
  }

  input UpdateRoleInput {
    name: String
    permissionIds: [String!]
  }
`;
