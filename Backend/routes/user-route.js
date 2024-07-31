const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {updateProfile, deleteUser, signout, getUsers, getUser } = require('../controllers/user-controller');
const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', verifyToken, signout);
router.get('/get-users', verifyToken, getUsers);
router.get('/:userId', getUser);

module.exports = router;