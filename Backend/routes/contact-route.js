const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { contactForm } = require('../controllers/contact-controller');
const router = express.Router();

router.post('/contact-form', verifyToken, contactForm);

module.exports = router;