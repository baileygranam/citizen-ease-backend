import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { resolvers } from './graphql/user/resolvers';
import { schema } from './graphql/user/schema';
import { ApolloContext } from './types';

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    const app = express();
    const httpServer = createServer(app);
    const apolloServer = new ApolloServer({
      typeDefs: schema,
      resolvers,
      // TODO: Pass payload from 'authorization' token
      context: async (): Promise<ApolloContext> => ({
        businessId: '',
        userId: ''
      })
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
