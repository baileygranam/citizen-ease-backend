import { gql } from 'apollo-server-express';

export const schema = gql`
  type AuthenticationTokens @public {
    accessToken: String!
    refreshToken: String!
  }

  type Mutation {
    authenticate(email: String!, password: String!): AuthenticationTokens!
      @public
    refreshToken(refreshToken: String!): String!
    logout: Boolean!
  }
`;
