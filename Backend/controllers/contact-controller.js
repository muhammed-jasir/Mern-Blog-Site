const Contact = require("../models/contact-model");
const errorHandlers = require('../utils/errorHandler');

const contactForm = async (req, res, next) => {
    const { name, email, phone, message } = req.body;
    const { userId } = req.user;

    if (!req.user) {
        return next(errorHandlers(401, 'Unauthorized: User must be logged in to submit a contact form'));
    }

    if (!name || !email || !phone || !message || name === '' || email === '' || phone === '' || message === '') {
        return next(errorHandlers(400, "All Fields are Required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
        return next(errorHandlers(400, 'Invalid Email format'));
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(String(phone))) {
        return next(errorHandlers(400, 'Phone number must be 10 digits long'));
    }

    if (message.length > 300) {
        return next(errorHandlers(400, 'Message must be less than or equal to 300 characters'));
    }

    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            message,
            userId,
        });

        await newContact.save();
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        next(error);
    }
};

const contactResponses = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandlers(403, 'Unauthorized: Only admin can view all Responses'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;

        const contactResponses = await Contact.find()
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.json(contactResponses);
    } catch (error) {
        next(error);
    }
};

const deleteContactResponse = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandlers(403, 'You are not allowed to delete this response'));
    }

    try {
        const response = await Contact.findById(req.params.responseId);

        if (!response) {
            return next(errorHandlers(404, 'Response not found'));
        }

        await Contact.findByIdAndDelete(req.params.responseId);
        res.status(200).json({ message: 'Response deleted successfully!!' });
    } catch (error) {
        next(error);
    }
};

module.exports = { contactForm, contactResponses, deleteContactResponse };
