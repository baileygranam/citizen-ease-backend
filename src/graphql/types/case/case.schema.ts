import { gql } from 'apollo-server-express';

export const schema = gql`
  type Case {
    id: UUID!
    status: CaseStatus!
    dueAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
    business: Business!
    client: Client!
    user: User!
  }

  enum CaseStatus {
    OPEN
    CLOSED
  }

  type Query {
    getCase(id: UUID!): Case!
    getCases: [Case!]!
  }

  type Mutation {
    createCase(data: CreateCaseInput!): Case!
    updateCase(id: UUID!, data: UpdateCaseInput!): Case!
    deleteCase(id: UUID!): Case!
  }

  input CreateCaseInput {
    dueAt: DateTime
    clientId: UUID!
    userId: UUID!
  }

  input UpdateCaseInput {
    status: CaseStatus
    dueAt: DateTime
    userId: UUID
  }
`;
