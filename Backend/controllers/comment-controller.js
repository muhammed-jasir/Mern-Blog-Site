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

const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorHandlers(404, 'Comment not found'));
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandlers(403, 'You are not allowed to edit this comment'));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            { new: true });

        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return next(errorHandlers(404, 'Comment not found'));
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandlers(403, 'You are not allowed to edit this comment'));
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: 'Comment deleted successfully!!' });

    } catch (error) {
        next(error);
    }
};

const getAllComments = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can view all comments'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1, 
            now.getDate()
        );

        const lastMonthComment = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            comments,
            totalComments,
            lastMonthComment,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { createComment, getPostComments, likeComment, editComment, deleteComment, getAllComments };