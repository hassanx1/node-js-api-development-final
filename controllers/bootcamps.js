const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../helpers/geocoder");
const Bootcamp = require("../models/Bootcamp");
const path = require("path");

//@desc      get all bootcamps
// @method   GET al/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc      get a single bootcamps
// @method   GET al/api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of  ${req.params.id}`, 500)
        );
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

//@desc      Create new single bootcamps
// @method   POST al/api/v1/bootcamps/
//@access    Private
exports.createBootcamp = asyncHandler(async(req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    // check for published boootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    // if the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

//@desc      update single bootcamps
// @method   PUT al/api/v1/bootcamps/
//@access    Private
exports.updateBootcamp = asyncHandler(async(req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // make sure user is bootcamp owner
    if (bootcamp.user.toString() != req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authoried to update this bootcamp`, 401)
        );
    }
    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: bootcamp });
});

//@desc      Delete single bootcamps
// @method   DELETE al/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler(async(req, res, next) => {
    // try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        // return res.status(400).json({
        //   success: false
        // })
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // make sure user is bootcamp owner
    if (bootcamp.user.toString() != req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authoried to delete this bootcamp`, 401)
        );
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {},
    });

    // } catch (err) {
    //   next(err);
    // }
});

//@desc      Delete bootcamps within a radius
// @method   GET al/api/v1/bootcamps/radius/;zipcode/:distance
//@access    Private
exports.getBootcampsInRadius = async(req, res, next) => {
    const { zipcode, distance } = req.params;

    // get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longtitude;

    // calc radius using radius
    // divide dist by radius of the earth
    // earth radius is 3,9663 mi, / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ],
            },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
};

//@desc      Upload photo for bootcamp
// @method   PUT al/api/v1/bootcamps/:id/photo
//@access    Private
exports.bootcampPhotoUpload = asyncHandler(async(req, res, next) => {
    // try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        // return res.status(400).json({
        //   success: false
        // })
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    // make sure user is bootcamp owner
    if (bootcamp.user.toString() != req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${req.params.id} is not authoried to upload a photo`, 404)
        );
    }
    if (!req.files) {
        new ErrorResponse(`User ${req.params.id} is not authoried to upload a file`, 404)
    }

    const file = req.files.file;

    // make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 404));
    }
});