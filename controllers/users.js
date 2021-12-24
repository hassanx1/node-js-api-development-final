const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc     Get All Users
// @method   GET al/api/v1/auth/users
//@access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc     Get Single User
// @method   GET al/api/v1/auth/users/:id
//@access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc     Create User
// @method   POST al/api/v1/auth/users
//@access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc     Update User
// @method   POST al/api/v1/auth/users
//@access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
});

//@desc     Delete User
// @method   DELETE al/api/v1/auth/users
//@access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {}
    });
});