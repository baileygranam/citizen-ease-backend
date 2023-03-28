import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/api',
  generates: {
    'src/graphql/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        defaultMapper: 'Partial<{T}>',
        contextType: 'src/types/index.ts#ApolloContext',
        mappers: {
          Business: '@prisma/client/index.d#Business as PrismaBusiness',
          User: '@prisma/client/index.d#User as PrismaUser',
          Role: '@prisma/client/index.d#Role as PrismaRole'
        },
        inputMaybeValue: 'undefined | T',
        useIndexSignature: true
      }
    }
  }
};

export default config;
