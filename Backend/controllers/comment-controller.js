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
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 5;

        const comments = await Comment.find({ postId: req.params.postId })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.json(comments);
    } catch (error) {
        next(error);
    }
};

const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorHandlers(404, 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.userId);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.userId);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getPostComments, likeComment };