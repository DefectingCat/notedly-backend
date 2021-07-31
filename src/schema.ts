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
  type CommentFeed {
    comments: [Comment]!
    cursor: String!
    hasNextPage: Boolean!
  }
  type Reply {
    parent: ID!
    content: String!
    author: User!
    toUser: User!
    favoriteCount: Int!
    favoritedBy: [User!]
  }
  type Comment {
    id: ID!
    content: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    reply: [Reply]
    post: ID!
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
    comments(cursor: String, post: ID!): CommentFeed!
  }
  type Mutation {
    newNote(content: String!): Note!
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String, password: String!): String!
    toggleFavorite(id: ID!): Note!
    newComment(content: String!, post: ID!, reply: ID, to: ID): Comment!
  }
`;
