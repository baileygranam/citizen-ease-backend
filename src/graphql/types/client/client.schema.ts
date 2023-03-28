import { gql } from 'apollo-server-express';

export const schema = gql`
  type Client {
    id: UUID!
    firstName: String!
    middleName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: Date
    gender: Gender
    preferredLanguage: Language
    maritalStatus: MartialStatus
    addressLine1: String
    addressLine2: String
    addressCity: String
    addressState: String
    addressZipcode: String
    addressCountry: String
    isTerminated: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  enum Language {
    ENGLISH
    SPANISH
    CHINESE
    TAGALOG
    VIETNAMESE
    JAPANESE
    ARABIC
    FRENCH
    ITALIAN
    POLISH
    KOREAN
    RUSSIAN
    PORTUGUESE
    HINDI
  }

  enum MartialStatus {
    SINGLE
    MARRIED
    DIVORCED
    SEPARATED
    WIDOWED
    DOMESTIC_PARTNERSHIP
    CIVIL_UNION
    ANNULLED
  }

  type Query {
    getClient(id: UUID!): Client!
    getClients: [Client!]!
  }

  type Mutation {
    createClient(data: CreateClientInput!): Client!
    updateClient(id: UUID!, data: UpdateClientInput!): Client!
    terminateClient(id: UUID!): Client!
  }

  input CreateClientInput {
    firstName: String!
    middleName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: Date
    gender: Gender
    preferredLanguage: Language
    maritalStatus: MartialStatus
    addressLine1: String
    addressLine2: String
    addressCity: String
    addressState: String
    addressZipcode: String
    addressCountry: String
  }

  input UpdateClientInput {
    firstName: String
    middleName: String
    lastName: String
    email: String
    phoneNumber: String
    dateOfBirth: Date
    gender: Gender
    preferredLanguage: Language
    maritalStatus: MartialStatus
    addressLine1: String
    addressLine2: String
    addressCity: String
    addressState: String
    addressZipcode: String
    addressCountry: String
  }
`;
