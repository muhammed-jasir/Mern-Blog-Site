const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {updateProfile, deleteUser, signout } = require('../controllers/user-controller');
const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', verifyToken, signout);

module.exports = router;