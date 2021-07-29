const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String]
      description: String
      bookId: String
      image: String
      link: String
      title: String): 
      Book
    removeBook(bookId: String!): Book
  }
`;
module.exports = typeDefs;