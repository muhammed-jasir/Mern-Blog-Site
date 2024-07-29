const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {createPost, getPosts, deletePost, updatePost} = require('../controllers/post-controller');
const router = express.Router();

router.post('/create-post', verifyToken, createPost);
router.get('/get-posts', getPosts);
router.delete('/delete-post/:postId/:userId', verifyToken, deletePost);
router.put('/update-post/:postId/:userId', verifyToken, updatePost);

module.exports = router;