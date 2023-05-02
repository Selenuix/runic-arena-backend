const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const cors = require('cors')

const cardsRouter = require('./routes/cards');
const typesRouter = require('./routes/types');
const classesRouter = require('./routes/classes');
const {join} = require("path");

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/public/uploads', express.static('public/uploads'))
app.use(cors())

app.use('/cards', cardsRouter);
app.use('/types', typesRouter);
app.use('/classes', classesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err);
});

module.exports = app;
