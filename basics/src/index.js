import { GraphQLServer } from 'graphql-yoga'

// location

// Type definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query!'
    },
    name() {
      return 'Jeremy'
    },
    location() {
      return `Concord, NC`
    },
    bio() {
      return `I put the fun in funeral!`
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