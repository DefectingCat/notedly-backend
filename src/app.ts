import Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';
import db from './db';
import config from './config';
import models from './models';

const DB_HOST = config.DB_HOST;

async function startApolloServer() {
  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    type Note {
      id: ID!
      content: String!
      author: String!
    }
    type Query {
      hello: String
      notes: [Note!]!
      note(id: ID!): Note!
    }
    type Mutation {
      newNote(content: String!): Note!
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      hello: () => 'Hello world!',
      notes: async () => await models.Note.find(),
      note: async (parent: unknown, args: { id: string }) =>
        await models.Note.findById(args.id),
    },
    Mutation: {
      newNote: async (parent: unknown, args: { content: string }) => {
        return await models.Note.create({
          content: args.content,
          author: 'xfy',
        });
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
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
