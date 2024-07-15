const bcrypt = require('bcryptjs');
const User = require("../models/user-model");
const errorHandlers = require('../utils/errorHandler');

const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandlers(400, "All Fields are Required"));
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return next(errorHandlers(400, "Username already Exists"));
    }

    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
        return next(errorHandlers(400, "Email is already Registered"));
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
        res.json({ success: true, message: 'Signup Successful' });
    } catch (error) {
        next(error);
    }
};

module.exports = signup;