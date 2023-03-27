import { gql } from 'apollo-server-express';

export const schema = gql`
  directive @public on OBJECT | FIELD_DEFINITION
`;
