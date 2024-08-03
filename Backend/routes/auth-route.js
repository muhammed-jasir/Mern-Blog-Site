const express = require('express');
const { signup, login, google } = require('../controllers/auth-controller');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', google);

module.exports = router;