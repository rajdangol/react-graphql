const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

// const { GraphQLScalarType} = require('graphql');
const { MONGODB } = require('./config.js');

const Post = require('./models/Posts');
const { GraphQLScalarType } = require('graphql');
const typeDefs = gql`
    scalar Date
    type Post{
        id: ID!,
        body: String!,
        userName: String!,
        createdAt: Date!
    }
    type Query{
        getPosts: [Post]
    }
`

const resolvers = {
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom Scalar Type',
        parseValue(value){
            return new Date(value);
        },
        serialize(value){
            return value.getTime();
        }
    }),
    Query: {
        async getPosts() {
            try{
                const posts = await Post.find();
                return posts;
            } catch(err){
                throw new Error(err);
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true}).then((res)=>{
    server.listen().then(res => {
    console.log(`Server running at ${res.url}`);
})
});