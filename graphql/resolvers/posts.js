const { GraphQLScalarType } = require('graphql');
const { AuthenticationError } = require('apollo-server');

const checkAuth = require('../../utils/authentication');
const Post = require('../../models/Posts');
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
        },
        async getPost(_,{ postId }) {
            try{
                const post = await Post.findById(postId);
                if (post){
                    return post;
                } else {
                    throw new Error('Post Not Found');
                }
            } catch(e) {
                throw new Error(e);
            }

        }
    },
    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);

            const newPost = new Post({
                body,
                user: user.indexOf,
                userName: user.userName,
                createdAt: new Date()
            });
            
            const post = await newPost.save();

            context.pubSub.publish('NEW_POST', {
                newPost: post
            })
            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                if (user.userName == post.userName){
                    await post.delete();
                    return 'Post Deleted Successfully';
                } else {
                    throw new AuthenticationError('Post Deletion Action not allowed');
                }

            } catch(err) {
                throw new Error(err);
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, args, { pubSub }) => pubSub.asyncIterator('NEW_POST')
        }
    }
}