const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user-route')
const authRoutes = require('./routes/auth-routes')

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => console.log('MongoDB is connected !!'))
.catch((error) => console.log(error));

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', function (req, res) {
    res.send('Hello World')
});

