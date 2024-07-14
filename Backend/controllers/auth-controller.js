const bcrypt = require('bcryptjs');
const User = require("../models/user-model");

const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: "All Fields are Required" });
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
        return res.status(500).json({ message: error.message });
    }
};

module.exports = signup;