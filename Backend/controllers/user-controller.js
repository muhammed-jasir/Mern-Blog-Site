const bcryptjs = require('bcryptjs');
const errorHandlers = require('../utils/errorHandler');
const User = require('../models/user-model');

const updateProfile = async (req, res, next) => {


    if (req.user.userId !== req.params.userId) {
        return next(errorHandlers(403, 'You are not allowed to update this profile'));
    }
    
    if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(req.body.email).toLowerCase())) {
            return next(errorHandlers(400,'Invalid Email format'));
        }
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandlers(400, 'Password must be at least 6 characters long'));
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]?)[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(req.body.password)) {
            return next(errorHandlers(400, 'Password must contain at least one uppercase letter, one lowercase letter, one digit.'));
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username.length < 3 || req.body.username.length > 20) {
            return next(errorHandlers(400, 'Username must be between 3 and 20 characters long'));
        }

        const usernameRegex = /^[a-zA-Z\d_ ]+$/;
        if (!usernameRegex.test(req.body.username)) {
            return next(errorHandlers(400, 'Username can only contain alphabets, numbers, underscores, and spaces'));
        }

    }

    try {

        const updateData = {
            username: req.body.username,
            email: req.body.email,
            profilePic: req.body.profilePic
        };

        if (req.body.password) {
            updateData.password = req.body.password;
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: updateData,
        }, { new: true });

        const { password, ...rest } = updatedUser.toObject();
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

}

const deleteUser = async (req, res, next) => { 
    if(req.user.userId !== req.params.userId) {
        return next(errorHandlers(403, 'You are not allowed to delete this User'));
    }

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: 'User deleted successfully!!'  });
    } catch (error) {
        next(error);
    }
}

module.exports = { updateProfile, deleteUser };