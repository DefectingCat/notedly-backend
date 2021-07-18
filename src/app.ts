import Koa from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import db from './db';
import models from './models';
import config from './config';
import typeDefs from './schema';
import resolvers from './resolvers';

const DB_HOST = config.DB_HOST;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
      return { models };
    },
  });
  await server.start();

  const app = new Koa();
  server.applyMiddleware({ app });

  db.connect(DB_HOST);

  await new Promise((resolve) => {
    app.listen({ port: 4000 });
    resolve('start');
  });
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

  return { server, app };
}
startApolloServer();
