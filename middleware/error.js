// * @Email: hassansaava@gmail.com

// * @LinkedIn: https://www.linkedin.com/in/hassan-muwonge-4a4592144/

// * @Github: https://github.com/mhassan654

// * @GitLab: https://gitlab.com/hmuwonge

// * @Tel: +256-783-828977 / +256-704-348792
// * Web: https://muwongehassan.com

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
        const message = `Resource not found with id of  ${err.value}`;
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