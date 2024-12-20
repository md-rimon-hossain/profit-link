const express = require("express");

const userRoute = express.Router();
const {
  registerValidation,
  verifyValidation,
  resendCodeValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require("../validation/userValidation");
const { runValidation } = require("../validation/validation");
const {
  registerUser,
  verifyUser,
  resendSignUpValidationCode,
  forgotPassword,
  resetPassword,
  getAllUsers,
  deleteSingleUser,
  deleteAllUsers
} = require("../controllers/user.controller");
const {
  userIsLoggedOut,
  checkAdmin
} = require("../middlewares/auth");


userRoute.get("/all-users", checkAdmin, getAllUsers);

userRoute.post(
  "/register",
  userIsLoggedOut,
  registerValidation,
  runValidation,
  registerUser
);

userRoute.post(
  "/verify",
  userIsLoggedOut,
  verifyValidation,
  runValidation,
  verifyUser
);

userRoute.post(
  "/resend-code",
  userIsLoggedOut,
  resendCodeValidation,
  runValidation,
  resendSignUpValidationCode
);

userRoute.post(
  "/forgot-password",
  userIsLoggedOut,
  forgotPasswordValidation,
  runValidation,
  forgotPassword
);

userRoute.post(
  "/reset-password",
  userIsLoggedOut,
  resetPasswordValidation,
  runValidation,
  resetPassword
);

userRoute.delete("/delete-user/:id",  deleteSingleUser);
userRoute.delete("/delete-all-users",  deleteAllUsers);

module.exports = userRoute;
