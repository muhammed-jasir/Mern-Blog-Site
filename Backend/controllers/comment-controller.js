const Comment = require('../models/comment-model');
const errorHandlers = require('../utils/errorHandler');

const createComment = async (req, res, next) => {
    try {
        const { userId, postId, content } = req.body;

        if (userId !== req.user.userId) {
            return next(errorHandlers(403, 'You are not allowed to create a comment on this post'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save();
        res.status(201).json(newComment);

    } catch (error) {
        next(error);
    }
};

const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1
        });
        res.json(comments);
    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getPostComments };