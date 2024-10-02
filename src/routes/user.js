const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName about skills profilePic age gender";

// GET all the PENDING connection requests for the loggedIn user

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

// GET all the sent requests which is sent by loggedIn user

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

// GET all the "accepted" connections for the loggedIn user

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

// GET all the users from DB except some conditions

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    // User should see all the profile except his own profile
    // The existing connections should not show
    //  User ignored people (user left swipes)
    // Connection request already sent profile

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    // const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const skip = (page - 1) * limit;

    // Finding all the connection request that user have sent and received
    const connectionRequests = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // using Set to find unique users

    const hideUsersFromFeed = new Set();

    // This used to find which users we should not show in feed
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    // DB condition to only new users profile should show
    // Already request sent and request received profiles and own profile should not show

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.status(400).send(`Error: ${error}`);
  }

  // Refactoring this code

  // Use Set to store user IDs to hide

  // const hideUsersFromFeed = new Set(
  //   connectionRequests.flatMap(req => [req.fromUserId.toString(), req.toUserId.toString()])
  // );

  // Add logged-in user's ID to the Set

  // hideUsersFromFeed.add(loggedInUser._id.toString());

  // Fetch users excluding hidden ones

  // const users = await User.find({
  //   _id: { $nin: Array.from(hideUsersFromFeed) }
  // })
});

module.exports = { userRouter };
