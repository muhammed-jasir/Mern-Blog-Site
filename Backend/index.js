const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user-route')
const authRoutes = require('./routes/auth-routes');
const postRoutes = require('./routes/post-route');
const commentRoutes = require('./routes/comment-route');

const cookieParser = require('cookie-parser');

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => console.log('MongoDB is connected !!'))
    .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

app.get('/', function (req, res) {
    res.send('Hello World')
});

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});