// * @Author: Muwonge Hassan Saava

// * @Email: hassansaava@gmail.com

// * @LinkedIn: https://www.linkedin.com/in/hassan-muwonge-4a4592144/

// * @Github: https://github.com/mhassan654

// * @GitLab: https://gitlab.com/hmuwonge

// * @Tel: +256-783-828977 / +256-704-348792
// * Web: https://muwongehassan.com

const crypto = require('crypto');
const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../helpers/sendEmail");
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


//@desc     Login User
// @method   POST al/api/v1/auth/login
//@access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;

  // validate email and password
  if(!email || !password){
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check user
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res)=>{
  // create token
  const token = user.getSignedJwtToken();

  const options = {
expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if(process.env.NODE_NEV === 'production'){
    options.secure =true;
  }

  res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token
      });
};

//@desc     Get currently logged in user User
// @method   POST al/api/v1/auth/me
//@access    Private
exports.getMe = asyncHandler(async (req, res, next) =>{
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc     Forgot Password
// @method   POST al/api/v1/auth/forgotpassword
//@access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) =>{
  const user = await User.findOne({email: req.body.email});

  if(!user){
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resettoken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false});

  console.log(resettoken);

  // create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resettoken}`;

  const message = `You are receiving this email because you (or someone else) has
  requested the reset of a password. Please make a PUT request to 
  \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({success: true, data: 'Email Sent!'});
  }catch (e) {
    console.log(e);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});
    return next(new ErrorResponse('Email could not be sent', 500));

  }
  res.status(200).json({
    success: true,
    data: user
  });
});

//@desc     Reset Password
// @method   POST al/api/v1/auth/resetpassord
//@access    Public
exports.resetPassword = asyncHandler(async (req, res, next) =>{
  // Get hashed token
  const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()}
  });

  if(!user){
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});
