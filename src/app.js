const express = require("express");
const { connectToDB } = require("./config/database");
const User = require("./models/user");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = 3000;

// USER SIGNUP AND  IF SUCCESS, USER DETAILS ADDING INTO DATABASE

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

// GET USER PROFILE

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

// SENDING CONNECTION TO OTHER PROFILES REQUEST

app.post("/sendingConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(
    `${user.firstName} ${user.lastName} sent you the connection request`
  );
});

// CONNECTING TO DATABASE AND STARTS THE SERVER ONLY IF DATABASE CONNECTION IS SUCCESS

connectToDB()
  .then(() => {
    console.log("Connected to Database successfully");
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
