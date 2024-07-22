const express = require('express');
const verifyToken = require('../utils/verifyUser');
const {updateProfile, deleteUser} = require('../controllers/user-controller');
const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile);
router.delete('/delete/:userId', verifyToken, deleteUser);

module.exports = router;