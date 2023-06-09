import express from 'express';
import dotenv from 'dotenv';
import depthLimit from 'graphql-depth-limit';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Authentication } from '@models';
import config from '@src/config';
import { ApolloContext } from '@src/types';
import { TokenType } from '@prisma/client';
import {
  getAuthenticatedSchema,
  getAuthorizedSchema
} from '@src/graphql/directives';

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const app = express();
    const httpServer = createServer(app);

    let schema = makeExecutableSchema({
      typeDefs: await loadFiles('src/graphql/types/**/*.schema.ts'),
      resolvers: await loadFiles('src/graphql/types/**/*.resolvers.ts')
    });

    schema = getAuthenticatedSchema(schema);
    schema = getAuthorizedSchema(schema);

    const apolloServer = new ApolloServer({
      schema,
      validationRules: [depthLimit(5)],
      introspection: config.NODE_ENV === 'development',
      formatError: (error) => {
        const { message, locations, path } = error;

        if (message.startsWith('\nInvalid `prisma')) {
          return new Error('Internal Server Error');
        }

        return { message, locations, path };
      },
      context: async ({ req }): Promise<ApolloContext> => {
        const accessToken = req.headers['x-access-token'] as string;

        const isTokenValid = await Authentication.isTokenValid(
          accessToken,
          TokenType.ACCESS
        );

        if (isTokenValid) {
          return Authentication.getTokenPayload(accessToken, TokenType.ACCESS);
        }

        return { businessId: '', userId: '' };
      }
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      path: '/api'
    });

    httpServer.listen({ port }, () =>
      console.log(
        `Server listening on localhost:${port}${apolloServer.graphqlPath}`
      )
    );
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

startServer();
