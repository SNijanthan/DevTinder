const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  passwordValidation,
} = require("../utils/validation");

const profileRouter = express.Router();

// GET USER PROFILE

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Email field cannot be changed");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `Dear ${loggedInUser.firstName}, Your changes has been updated`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    passwordValidation(req);

    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const loggedInUser = req.user;

    loggedInUser.password = hashPassword;

    await loggedInUser.save();

    res.send("Password has been updated");
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

module.exports = { profileRouter };
