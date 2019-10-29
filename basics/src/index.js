import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [{
  id: '1',
  name: 'Jeremy',
  email: 'jeremy@example.com',
  age: 38
}, {
  id: '2',
  name: 'Amy',
  email: 'amy@example.com'
}, {
  id: '3',
  name: 'Moses',
  email: 'moses@example.com'
}]

// Demo post data
const posts = [{
  id: '101',
  title: 'Getting Started with GraphQL',
  body: 'Blah Blah Blah',
  published: true,
  author: '1'
}, {
  id: '102',
  title: 'GraphQL: Next Steps',
  body: 'Yada, yada, yada...',
  published: false,
  author: '1'
}, {
  id: '103',
  title: 'Mastering the Art of Fart',
  body: 'Pffffft',
  published: false,
  author: '2'
}]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
    author: User!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }
      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
      })
    },
    me() {
      return {
        id: 12345,
        name: 'Mike',
        email: 'mike@example.com'
      }
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
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
