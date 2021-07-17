//@desc      get all bootcamps
// @method   GET al/api/v1/bootcamps
//@access    Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({success: true, msg: "show all bootcamps"});
};

//@desc      get a single bootcamps
// @method   GET al/api/v1/bootcamps/:id
//@access    Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({success: true, msg: `Show bootcamp ${req.params.id}`});
};

//@desc      Create new single bootcamps
// @method   POST al/api/v1/bootcamps/
//@access    Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({success: true, msg: "create bootcamps"});
};

//@desc      update single bootcamps
// @method   PUT al/api/v1/bootcamps/
//@access    Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({success: true, msg: `Update bootcamp ${req.params.id}`});
};

//@desc      Delete single bootcamps
// @method   DELETE al/api/v1/bootcamps/:id
//@access    Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({success: true, msg: `Delete bootcamp ${req.params.id}`});
};
