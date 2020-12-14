const { gql } = require('apollo-server');

module.exports = gql`
scalar Date
type Post{
    id: ID!,
    body: String!,
    userName: String!,
    createdAt: Date!,
    comments: [Comment]!,
    likes: [Like]!
}
type Comment{
    id: ID!,
    createdAt: Date!,
    userName: String!,
    body: String!
}
type Like{
    id: ID!,
    createdAt: Date!,
    userName: String!
}
type User{
    id: ID!,
    email: String!,
    userName: String!,
    token: String!,
    password: String!
    createdAt: Date!,
}
input RegisterInput{
    userName: String!,
    password: String!,
    confirmPassword: String!,
    email: String!
}
type Query{
    getPosts: [Post]
    getPost(postId: ID!): Post
}
type Mutation{
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
}
type Subscription{
    newPost: Post!
}
`