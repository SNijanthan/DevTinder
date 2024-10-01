const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRequestRouter = express.Router();

// SENDING CONNECTION TO OTHER PROFILES REQUEST

connectionRequestRouter.post(
  "/profile/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedFields = ["interested", "ignored"];
      if (!allowedFields.includes(status)) {
        throw new Error(`Invalid status : ${status}`);
      }

      const user = req.user;

      // This logic is written in DATABASE

      // if (fromUserId === toUserId) {
      //   throw new Error("You cannot send request to yourself");
      // }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error(`User does not exists`);
      }

      const existingConnectionRequest = await ConnectionRequests.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already sent");
      }

      const connectionRequest = new ConnectionRequests({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `From: ${user.firstName}, To: ${toUser.firstName}, status: ${status}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`Error: ${error}`);
    }
  }
);

module.exports = { connectionRequestRouter };
