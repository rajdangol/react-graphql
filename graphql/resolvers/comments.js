const postResolvers = require('./posts');
const userResolvers = require('./users');

const checkAuth = require('../../utils/authentication');
const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Posts');
module.exports = {
    Query: {
        
    },
    Mutation: {
        createComment: async(_, { postId, body }, context) => {
            const { userName } = checkAuth( context );

            if (body.trim() === '') {
                throw new UserInputError('Empty Comment', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                });

            }

            const post = await Post.findById(postId);

            if (post) {
                post.comments.unshift({
                    body,
                    userName,
                    createdAt: new Date()

                });
                await post.save();
                return post;
        
            } else {
                throw new UserInputError('Post Not Found');
            }
        },
        async deleteComment(_, { postId, commentId }, context ){
            const { userName } = checkAuth( context );

            const post = await Post.findById(postId);

            if (post) {
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if (commentIndex > 0){

                    if (post.comments[commentIndex].userName === userName) {
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                        return post;
                    } else {
                        throw new AuthenticationError('Action not allowed');
                    }
                } else throw new UserInputError('Comment not found');
            } else throw new UserInputError('Post not found');
        }
    }
}