import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    post: Post!
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    post() {
      return {
        id: '56789',
        title: 'Getting started with GraphQL',
        body: 'Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh.',
        published: true
      }
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('The server is up!')
})