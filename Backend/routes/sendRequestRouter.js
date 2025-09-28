const express = require("express");
const userAuth = require("../utils/middleware/userAuth");
const Connection = require("../models/connectionSchema");
const User = require("../models/userSchema");
const sendRequestRouter = express.Router();

sendRequestRouter.post(
  "/send/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      // Validate toUserId and status
      if (!toUserId || !status) {
        return res.status(400).send("toUserId and status are required");
      }
      // Verify receiver exists
      const receiver = await User.findById(toUserId);
      if (!receiver) {
        return res.status(404).send(`User with ID ${toUserId} not found`);
      }

      // Extracting sender's info , not verifying as it is done by userAuth
      const sender = await User.findById(fromUserId);

      // Check for existing connection (either direction)
      const existingConnection = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(409).send("Connection request already exists");
      }



      // Create new connection
      const connection = new Connection({
        fromUserId,
        toUserId,
        status,
      });

      // Save connection
      const savedConnection = await connection.save();
      console.log(savedConnection);

      // Send response
      res.status(201).json({
        message: `${sender.firstName} is ${status} in ${receiver.firstName}`,
        connection: savedConnection,
      });
    } catch (err) {
      console.error("Error sending connection request:", err);
      res.status(500).send(`Server error: ${err.message}`);
    }
  }
);
sendRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatusByUser = [`accepted`, `rejected`];
      const { status, requestId } = req.params;
      console.log(`status ` + status);

      if (!allowedStatusByUser.includes(status)) {
        return res.send(`${status} is not vaid`);
      }
      const connection = await Connection.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: `interested`,
      });
      console.log("Fetched connection:", connection);
      if (!connection) {
        return res
          .status(404)
          .send("Connection request not found");
      }
      connection.status = status;
      const data = await connection.save();
      res.send(data);
    } catch (err) {
      res.send(`ERROR ` + err.message);
    }
  }
);
  
module.exports = sendRequestRouter;
