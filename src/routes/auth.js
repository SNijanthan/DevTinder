const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { signUpValidation } = require("../utils/validation");

const authRouter = express.Router();

// USER SIGNUP AND  IF SUCCESS, USER DETAILS ADDING INTO DATABASE

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of user
    signUpValidation(req);

    const { firstName, lastName, email, password } = req.body;

    // Password encryption

    const hashPassword = await bcrypt.hash(password, 10);

    // Adding user

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    await user.save();
    res.send("User added Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//LOGIN USER AND IF LOGIN SUCCESS, JWT TOKEN ATTACHED TO TOKEN AS COOKIE

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email address, Please check again");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Creating JWT token

      const token = await user.getJWT();

      // Adding the token to cookie and send the response back to the user

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // COOKIE EXPIRES IN 7 DAYS
      });
      res.send("Login Successful");
    } else {
      throw new Error("Incorrect credentials");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

//LOGOUT USER

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.send("Logout Successful");
});

module.exports = { authRouter };
