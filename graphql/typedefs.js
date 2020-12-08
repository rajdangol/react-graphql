const { gql } = require('apollo-server');

module.exports = gql`
scalar Date
type Post{
    id: ID!,
    body: String!,
    userName: String!,
    createdAt: Date!
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
}
type Mutation{
    register(registerInput: RegisterInput): User!
    login(userName: String!, password: String!): User!
}
`