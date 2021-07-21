const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

//@desc      get all bootcamps
// @method   GET al/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });



});

//@desc      get a single bootcamps
// @method   GET al/api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of  ${req.params.id}`, 500));
  }
  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

//@desc      Create new single bootcamps
// @method   POST al/api/v1/bootcamps/
//@access    Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });



});

//@desc      update single bootcamps
// @method   PUT al/api/v1/bootcamps/
//@access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return res.status(400).json({
      success: false
    })
  }



});

//@desc      Delete single bootcamps
// @method   DELETE al/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({
        success: false
      })
    }

  } catch (err) {
    next(err);
  }


};