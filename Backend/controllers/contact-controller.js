const Contact = require("../models/contact-model");
const errorHandlers = require('../utils/errorHandler');

const contactForm = async (req, res, next) => {
    const { name, email, phone, message } = req.body;

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


    try {
        const newContact = new Contact({
            name,
            email,
            phone,
            message
        });
        await newContact.save();
        res.status(201).json({ message: "Form submitted successfully" });
    } catch (error) {
        next(error);
    }

};

module.exports = { contactForm };
