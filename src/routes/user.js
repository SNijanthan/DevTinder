const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName about skills profilePic age gender";

// Get all the PENDING connection requests for the loggedIn user

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => row.fromUserId);

    res.json({ message: "Received Requests", data });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

// Get all the sent requests which is sent by loggedIn user

userRouter.get("/user/requests/send", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequests.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate(
      "toUserId",
      "firstName lastName about skills profilePic age gender"
    );

    const data = connectionRequest.map((row) => row.toUserId);

    res.json({
      message: "The requests which you sent",
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

// Get all the "accepted" connections for the loggedIn user

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectedUsers = await ConnectionRequests.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectedUsers.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Retrieved all the connections",
      data,
    });
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }
});

module.exports = { userRouter };
