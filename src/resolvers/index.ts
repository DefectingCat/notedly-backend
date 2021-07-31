import Query from './query';
import Mutation from './mutation';
import Note from './note';
import User from './user';
import Comment from './comment';
import Reply from './reply';
import { GraphQLDateTime } from 'graphql-iso-date';

export default {
  Query,
  Mutation,
  Note,
  User,
  Comment,
  Reply,
  DateTime: GraphQLDateTime,
};
