import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000/api',
  generates: {
    'src/graphql/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        defaultMapper: 'Partial<{T}>',
        mappers: {
          User: '@prisma/client/index.d#User as PrismaUser'
        },
        useIndexSignature: true
      }
    }
  }
};

export default config;
