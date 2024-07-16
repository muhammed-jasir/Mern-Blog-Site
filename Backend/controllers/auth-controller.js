const bcryptjs = require('bcryptjs');
const User = require("../models/user-model");
const errorHandlers = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');

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

    const hashedPassword = bcryptjs.hashSync(password, 10);

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

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandlers(400, 'All Fields are Required'));
    }

    try {
        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandlers(400, 'User not Found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);

        if (!validPassword) {
            return next(errorHandlers(400, 'Invalid password'));
        }

        const token = jwt.sign(
            { userId: validUser._id },
            process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser.toObject();

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);

    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };
