const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');

const multer = require('multer')

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.1.0",
        "swagger": "2.0",
        info: {
            title: "Runic Arena",
            version: "0.0.0",
            description:
                "A simple TCG",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Selenuix",
                url: "https://ciszekanthony.fr",
                email: "contact@ciszekanthony.fr",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

const cardsRouter = require('./routes/cards');
const typesRouter = require('./routes/types');
const classesRouter = require('./routes/classes');

const app = express();

app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(specs, {explorer: true})
);

app.use(logger('dev'));
app.use(express.json());

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
