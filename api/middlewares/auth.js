const { verifyJsonWebToken } = require("../helper/jsonWebToken");
const { refreshTokenKey } = require("../secret");
const User = require("../models/User");

const userIsLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies)
    const affiliate = req.cookies?.affiliate || req.headers["affiliate"];

    if (!affiliate) {
      return res
        .status(401)
        .send({ msg: "You are already logged out. Please login first." });
    }

    const userInfo = verifyJsonWebToken(affiliate, refreshTokenKey);

    if (!userInfo) {
      return res.status(401).send({
        msg: "Token verification failed! Please logOut and login again!!"
      });
    }

    req.email = userInfo.email;
    req.id = userInfo.id;
    next();
  } catch (error) {
    return next(error);
  }
};

const userIsLoggedOut = async (req, res, next) => {
  try {
    const affiliate = req.cookies?.affiliate || req.headers["affiliate"];
    const { email } = req.body;


    if (!affiliate) {
      return next();
    }

    const userInfo = verifyJsonWebToken(affiliate, refreshTokenKey);

    
    if (userInfo && email == userInfo.email) {
      // Check if the user exists in the database
      const user = await User.findOne({
        where: { id: userInfo.id, email: userInfo.email },
      });

      if (!user) {
        return res
          .status(404)
          .send({ msg: "User does not exist. Please register first." });
      }
    } 
    next();
  } catch (error) {
    next(error);
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    const affiliate = req.cookies?.affiliate || req.headers["affiliate"];

    if (!affiliate) {
      return res
        .status(401)
        .send({ msg: "You are already logged out. Please login first." });
    }

    const userInfo = verifyJsonWebToken(affiliate, refreshTokenKey);

    if (!userInfo) {
      return res.status(401).send({
        msg: "Token verification failed! Please logOut and login again!!"
      });
    }

    const user = await User.findOne({ where: { email: userInfo.email } });

    console.log(user);

    if (!user.isAdmin) {
      console.log("first");
      return res.status(401).json({
        message: "Unauthorized Access"
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { userIsLoggedIn, userIsLoggedOut, checkAdmin };
