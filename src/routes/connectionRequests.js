const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequests = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRequestRouter = express.Router();

// SENDING CONNECTION TO OTHER PROFILES REQUEST

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user.id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const convertedToLowercase = status.toLowerCase();

      //  Only ["interested", "ignored"] these 2 fields can allow nothing other than that
      const allowedFields = ["interested", "ignored"];
      if (!allowedFields.includes(convertedToLowercase)) {
        throw new Error(`Invalid status : ${convertedToLowercase}`);
      }

      const user = req.user;

      // This logic is written in DATABASE

      // The user giving ID is not their own ID
      // if (fromUserId === toUserId) {
      //   throw new Error("You cannot send request to yourself");
      // }

      // Checking whether the user with this ID is exists or not
      const toUser = await User.findById(toUserId);

      if (!toUser) {
        throw new Error(`User does not exists`);
      }

      // They already have/sent connection request or not and also it prevents giving request to the same user twice
      const existingConnectionRequest = await ConnectionRequests.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequests({
        fromUserId,
        toUserId,
        status: convertedToLowercase,
      });

      const data = await connectionRequest.save();

      res.json({
        message: `From: ${user.firstName}, To: ${toUser.firstName}, status: ${convertedToLowercase}`,
        data,
      });
    } catch (error) {
      res.status(400).send(`Error: ${error}`);
    }
  }
);

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { requestId, status } = req.params;

      // Only allowing to update "ACCEPTED" and "REJECTED" status
      const allowedFields = ["accepted", "rejected"];

      if (!allowedFields.includes(status)) {
        return res
          .status(400)
          .json({ message: "Allowed actions - Accepted or rejected" });
      }

      //  RequestId should same as already given connectionRequestId
      //  toUserId only should match with loggedInUserId -> Then only the concern user can review the request
      // status should be only "interested". Anything other than this will not be acceptable

      const connectionRequest = await ConnectionRequests.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "Invalid connection request" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: `Request has been ${status}`, data });
    } catch (error) {
      res.status(400).send(`Error: ${error}`);
    }
  }
);

module.exports = { connectionRequestRouter };
