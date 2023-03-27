import { gql } from 'apollo-server-express';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';

export const schema = gql`
  directive @public on OBJECT | FIELD_DEFINITION

  ${scalarTypeDefs}
`;
