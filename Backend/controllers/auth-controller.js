const bcrypt = require('bcryptjs');
const User = require("../models/user-model");
const errorHandlers = require('../utils/errorHandler');

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandlers(400, "All Fields are Required"));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User(
        {
            username,
            email,
            password: hashedPassword,
        }
    )

    try {
        await newUser.save();
        res.json('Signup Successfull');
    } catch (error) {
        next(error);
    }
};

module.exports = signup;