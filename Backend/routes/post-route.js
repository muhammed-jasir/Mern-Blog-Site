const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {createPost, getPosts} = require('../controllers/post-controller');
const router = express.Router();

router.post('/create-post', verifyToken, createPost);
router.get('/get-posts', getPosts);

module.exports = router;