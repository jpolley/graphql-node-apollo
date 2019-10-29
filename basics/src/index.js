import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [{
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
let posts = [{
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
let comments = [{
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
  
  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment! 
  }
  
  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }
  
  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  
  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email)

      if (emailTaken) {
        throw new Error('User email already exists.')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }

      users.push(user)

      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = users.splice(userIndex, 1)

      posts = posts.filter((post) => {
        const match = post.author === args.id

        if (match) {
          comments = comments.filter((comment) => {
            return comment.post!== post.id
          })
        }

        return !match
      })
      comments = comments.filter((comment) => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)

      if (!userExists) {
        throw new Error('User not found.')
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post)

      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.data.author)
      const postExists = posts.some((post) => post.id === args.data.post && post.published)

      if (!userExists || !postExists) {
        throw new Error('Unable to find user/post.')
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }

      comments.push(comment)

      return comment
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
