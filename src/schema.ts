import { gql } from 'apollo-server-koa';

export default gql`
  scalar DateTime
  type Note {
    id: ID!
    content: String!
    author: User
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]
  }
  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    favorites: [Note!]!
  }
  type Query {
    notes: [Note!]!
    note(id: ID!): Note!
    user(username: String!): User!
    users: [User!]!
    me: User!
    noteFeed(cursor: String): NoteFeed!
    myNotes(cursor: String): NoteFeed!
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
  }
`;
