import Koa from 'koa';
import { ApolloServer, gql } from 'apollo-server-koa';

const notes = [
  { id: '1', content: 'This is a note.', author: 'xfy' },
  { id: '2', content: 'This is a another note.', author: 'dfy' },
  { id: '3', content: 'This is a another another note.', author: 'Arthur' },
];

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
      notes: () => notes,
      note: (parent: unknown, args: { id: string }) => {
        return notes.find((item) => item.id === args.id);
      },
    },
    Mutation: {
      newNote: (parent: unknown, { content }: { content: string }) => {
        const newValue = {
          id: String(notes.length),
          content,
          author: 'xfy',
        };
        notes.push(newValue);
        return newValue;
      },
    },
  };

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const app = new Koa();
  server.applyMiddleware({ app });

  await new Promise((resolve) => {
    app.listen({ port: 4000 });
    resolve('start');
  });
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);

  return { server, app };
}
startApolloServer();
