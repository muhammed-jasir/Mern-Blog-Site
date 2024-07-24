const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            default: 'Uncategorized',
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            default: 'https://t4.ftcdn.net/jpg/02/07/53/83/360_F_207538366_r6yerLIhPIU5uRkk66T1QUzTcpI9rtzZ.jpg',
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
    }, { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;