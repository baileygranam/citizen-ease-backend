import { gql } from 'apollo-server-express';

export const schema = gql`
  type AuthenticationTokens @public {
    accessToken: JWT!
    refreshToken: JWT!
  }

  type Mutation {
    authenticate(email: String!, password: String!): AuthenticationTokens!
      @public
    refreshToken(refreshToken: JWT!): String! @public
    logout: Boolean!
  }
`;
