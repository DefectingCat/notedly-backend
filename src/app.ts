import Koa, { Context } from 'koa';
import { ApolloServer } from 'apollo-server-koa';
import db from './db';
import models from './models';
import config from './config';
import typeDefs from './schema';
import resolvers from './resolvers';
// util
import getUser from './util/getUser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import cors from '@koa/cors';

const DB_HOST = config.DB_HOST;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }: { ctx: Context }) => {
    const token = ctx.req.headers.authorization;
    let user;
    // 验证用户 token
    if (token) user = getUser(token);
    // 并传递到上下文中
    return { models, user };
  },
});

const app = new Koa();

app.use(logger());
app.use(cors());

server.start().then(() => {
  app.use(server.getMiddleware());
});

db.connect(DB_HOST);

app.use(helmet());

app.listen({ port: 4000 });
console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
