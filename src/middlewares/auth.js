const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // READ THE TOKEN FROM REQ.COOKIES
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    // VALIDATING TOKEN

    const isTokenValid = await jwt.verify(token, "thisISsPrivateKey");

    const { _id } = isTokenValid;

    //FIND THE USER

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
};

module.exports = { userAuth };
