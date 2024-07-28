const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {createPost, getPosts, deletePost} = require('../controllers/post-controller');
const router = express.Router();

router.post('/create-post', verifyToken, createPost);
router.get('/get-posts', getPosts);
router.delete('/delete-post/:postId/:userId', verifyToken, deletePost);

module.exports = router;