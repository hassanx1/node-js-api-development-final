const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../helpers/geocoder");
const Bootcamp = require("../models/Bootcamp");

//@desc      get all bootcamps
// @method   GET al/api/v1/bootcamps
//@access    Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy re.query
  const reqQuery = {
    ...req.query,
  };
  // fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removefields and delete them from requery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string

  let queryStr = JSON.stringify(req.query);

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `${match}`);

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");
  // console.log(queryStr);

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

//@desc      get a single bootcamps
// @method   GET al/api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc      update single bootcamps
// @method   PUT al/api/v1/bootcamps/
//@access    Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return res.status(400).json({
      success: false,
    });
  }
});

//@desc      Delete single bootcamps
// @method   DELETE al/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
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
exports.getBootcampsInRadius = async (req, res, next) => {
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
        $centerSphere: [[lng, lat], radius],
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
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
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
});
