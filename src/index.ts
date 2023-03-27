import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { Authentication } from '@models';
import { ApolloContext } from './types';
import { TokenType } from '@prisma/client';
import { getAuthorizedSchema } from './graphql/directives/public.directive';

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

    schema = getAuthorizedSchema(schema);

    const apolloServer = new ApolloServer({
      schema,
      context: async ({ req }): Promise<ApolloContext> => {
        const accessToken = req.headers['x-access-token'] as string;

        const isTokenValid = await Authentication.isTokenValid(
          accessToken,
          TokenType.ACCESS
        );

        if (isTokenValid) {
          return Authentication.getTokenPayload(accessToken);
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
