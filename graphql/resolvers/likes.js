const postResolvers = require('./posts');
const userResolvers = require('./users');

const checkAuth = require('../../utils/authentication');
const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Posts');

module.exports = {
    Mutation: {
        async likePost(_, { postId }, context){
            const { userName } = checkAuth( context );
            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find(like => like.userName === userName)){
                    post.likes = post.likes.filter(like => like.userName !== userName);
                } else {
                    post.likes.push({
                        userName,
                        createdAt: new Date()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    }
}