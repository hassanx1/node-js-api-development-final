const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Reviews');
const Bootcamp = require('../models/Bootcamp');


//@desc Get reviews
// @desc PUT /api/v1/bootcamps/:bootcamp/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
    const reviews = await Review.find({bootcamp: req.params.bootcampId});

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
}});
