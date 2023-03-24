import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/api',
  generates: {
    'src/graphql/__generated__/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        defaultMapper: 'Partial<{T}>',
        mappers: {
          User: '@prisma/client/index.d#User as PrismaUser'
        },
        inputMaybeValue: 'undefined | T',
        useIndexSignature: true
      }
    }
  }
};

export default config;
