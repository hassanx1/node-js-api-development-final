const ErrorResponse = require('../helpers/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {
        ...err
    }
    // logger to console for dev
    error.message = err.message;
    console.log(err);

    // mongoose bad request
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of  ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // mongoose duplicate error message
    if (err.code === 11000) {
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }





    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;