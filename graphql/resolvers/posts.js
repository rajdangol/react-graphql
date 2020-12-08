const Post = require('../../models/Posts');
const { GraphQLScalarType } = require('graphql');
module.exports = {
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