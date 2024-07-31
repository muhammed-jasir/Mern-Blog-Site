const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { createComment, getPostComments } = require('../controllers/comment-controller');
const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/get-comments/:postId', getPostComments)

module.exports = router;