const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc     Register User
// @method   POST al/api/v1/auth/register
//@access    Public
exports.register = asyncHandler(async (req, res, next) => {
    const {name, email, password, role} = req.body;

    // create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);

});