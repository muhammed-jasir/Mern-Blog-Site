const Post = require('../models/post-model');
const slugify = require('slugify');
const errorHandlers = require('../utils/errorHandler');


const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can create a post'));
    }

    if (!req.body.title || !req.body.content || !req.body.category) {
        return next(errorHandlers(400, 'All Fields are Required'));
    }

    if (req.body.title.length < 5 || req.body.title.length > 100) {
        return next(errorHandlers(400, 'Title must be between 5 and 100 characters long'));
    }

    if (req.body.content.length < 10) {
        return next(errorHandlers(400, 'Content must be at least 10 characters long'));
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

module.exports = create;