import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
  type Query {
    add(a: Float!, b: Float!): Float!
    greeting(name: String, position: String): String!
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
    add(parent, args) {
      return args.a + args.b;
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorite ${args.position}.`
      } else {
        return `Hello!`
      }

    },
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