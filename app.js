const createError = require('http-errors');
const express = require('express');
const app = express();


const todoRouter = require('./routes/todos');
const usersRouter = require('./routes/users');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {

    res.status(err.status || 500)
        .json({
            status: 'error',
            message: err.message
        });


});

module.exports = {app};
