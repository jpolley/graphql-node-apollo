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

// Demo comment data
const comments = [{
  id: '401',
  text: 'Allow omitting constant primitive deps',
  author: '3',
  post: '101'
}, {
  id: '402',
  text: 'Deprecate ref.setNativeProps in favor of ReactNative.setNativeProps',
  author: '1',
  post: '101'
}, {
  id: '403',
  text: 'Fix UMD builds by re-exporting the scheduler priorities',
  author: '2',
  post: '102'
}, {
  id: '404',
  text: 'Remove false positive warning and add TODOs about `current` being non-null',
  author: '1',
  post: '102'
}]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments(query: String): [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!
    author: User!,
    comments: [Comment!]!
  }
   
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      return comments
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
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post)
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id)
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
