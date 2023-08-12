const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const noteRoutes = require('./api/routes/noteRoutes'); // include the noteRoutes.js folder
const userRoute = require('./api/routes/userRoute');

require('dotenv').config();

mongoose.connect("mongodb+srv://" + process.env.DB_USERNAME + ":"+ process.env.DB_PASSWORD +"@notesdb.kjqglss.mongodb.net/?retryWrites=true&w=majority");

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => { res.json({ message: "Welcome!" }) });
app.use('/api/user', userRoute);
app.use('/api/notes', noteRoutes); // anything that starts with /api/notes will be forwarded to noteRoutes.js folder

//if it reaches here it means there is no such route defined

app.use((req,res,next) => {
    const error = new Error('Route not found.');
    error.status = 404;
    next(error);
});

//server error/smt else
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;