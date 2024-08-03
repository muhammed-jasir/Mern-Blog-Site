const Post = require('../models/post-model');
const slugify = require('slugify');
const errorHandlers = require('../utils/errorHandler');


const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can create a post'));
    }

    if (!req.body.title || !req.body.description || !req.body.content || !req.body.category) {
        return next(errorHandlers(400, 'All Fields are Required'));
    }

    if (req.body.title.length < 5 || req.body.title.length > 100) {
        return next(errorHandlers(400, 'Title must be between 5 and 100 characters long'));
    }

    if (req.body.description.length < 10 || req.body.description.length > 300 ) {
        return next(errorHandlers(400, 'Description must be between 10 and 300 characters long'));
    }

    if (req.body.content.length < 50) {
        return next(errorHandlers(400, 'Content must be at least 50 characters long'));
    }

    const slug = slugify(req.body.title, {
        lower: true,
        strict: true,
        replacement: '-',
    });

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.userId
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {

        if (error.code === 11000) {
            return next(errorHandlers(400, 'A post with this title already exists.'));
        }

        next(error);
    }
}

const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find(
            {
                ...(req.query.userId && { userId: req.query.userId }),
                ...(req.query.category && { category: req.query.category }),
                ...(req.query.slug && { slug: req.query.slug }),
                ...(req.query.postId && { _id: req.query.postId }),
                ...(req.query.searchTerm && {
                    $or: [
                        { title: { $regex: req.query.searchTerm, $options: 'i' } },
                        { content: { $regex: req.query.searchTerm, $options: 'i' } },
                        { description: { $regex: req.query.searchTerm, $options: 'i' } },
                    ],
                }),
            }
        ).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() -1, 
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
        
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can delete a post'));
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully!!' });

    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.userId !== req.params.userId) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can update a post'));
    }

    if (!req.body.title || !req.body.description || !req.body.content || !req.body.category) {
        return next(errorHandlers(400, 'All Fields are Required'));
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                    slug: slugify(req.body.title, {
                        lower: true,
                        strict: true,
                        replacement: '-',
                    }),
                }
            }, {new: true }
        )

        res.status(200).json(updatedPost);
        
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getPosts, deletePost, updatePost };