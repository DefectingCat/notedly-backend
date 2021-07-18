import Query from './query';
import Mutation from './mutation';
import { GraphQLDateTime } from 'graphql-iso-date';

export default {
  Query,
  Mutation,
  DateTime: GraphQLDateTime,
};
