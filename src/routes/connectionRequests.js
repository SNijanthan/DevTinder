const express = require("express");
const { userAuth } = require("../middlewares/auth");

const connectionRequestRouter = express.Router();

// SENDING CONNECTION TO OTHER PROFILES REQUEST

connectionRequestRouter.post(
  "/sendingConnectionRequest",
  userAuth,
  (req, res) => {
    const user = req.user;
    res.send(
      `${user.firstName} ${user.lastName} sent you the connection request`
    );
  }
);

module.exports = { connectionRequestRouter };
