const express = require("express");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { connectionRequestRouter } = require("./routes/connectionRequests");
const { userRouter } = require("./routes/user");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const port = 3000;

// EXPRESS ROUTERS

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

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
