const express = require('express');
const verifyToken = require('../utils/verifyUser');
const updateProfile = require('../controllers/user-controller');
const router = express.Router();

router.put('/update/:userId', verifyToken, updateProfile);

module.exports = router;