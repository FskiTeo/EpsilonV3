require("./config/db");

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const courseRoutes = require('./routes/course.routes');
const { checkUser } = require('./middleware/auth.middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);

// Import routes
app.use('/api/user', userRoutes);

app.use('/api/courses', courseRoutes);

// Start the server
app.listen(port, () => {
    console.log(`EpsilonAPI is listening on ${port}`);
})
