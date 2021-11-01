// * @Author: Muwonge Hassan Saava

// * @Email: hassansaava@gmail.com

// * @LinkedIn: https://www.linkedin.com/in/hassan-muwonge-4a4592144/

// * @Github: https://github.com/mhassan654

// * @GitLab: https://gitlab.com/hmuwonge

// * @Tel: +256-783-828977 / +256-704-348792
// * Web: https://muwongehassan.com

const ErrorResponse = require("../helpers/errorResponse");
const asyncHandler = require("../middleware/async");

const User = require("../models/User");

//@desc     Register User
// @method   GET al/api/v1/auth/register
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

  // create token
  const token = user.getSignedJwtToken();

  res.status(200).json({success:true, token})

});
