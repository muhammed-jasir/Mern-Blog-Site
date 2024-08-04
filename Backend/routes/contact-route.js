const express = require('express');
const verifyToken = require('../utils/verifyUser');
const { contactForm, contactResponses, deleteContactResponse } = require('../controllers/contact-controller');
const router = express.Router();

router.post('/contact-form', verifyToken, contactForm);
router.get('/get-responses', verifyToken, contactResponses);
router.delete('/delete-response/:responseId', verifyToken, deleteContactResponse);

module.exports = router;