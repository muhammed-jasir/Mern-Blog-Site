const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { createComment, getPostComments, likeComment, editComment, deleteComment, getAllComments } = require('../controllers/comment-controller');
const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/get-post-comments/:postId', getPostComments);
router.put('/like-comment/:commentId', verifyToken, likeComment);
router.put('/edit-comment/:commentId', verifyToken, editComment);
router.delete('/delete-comment/:commentId', verifyToken, deleteComment);
router.get('/get-comments', verifyToken, getAllComments);

module.exports = router;