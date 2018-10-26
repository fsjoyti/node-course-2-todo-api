const express = require('express');
const app = express();


const {User} = require('./models/user');
const todoRouter = require('./routes/todos');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = {app};
