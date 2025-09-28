const express = require("express");
const userAuth = require("../utils/middleware/userAuth");
const Connection = require("../models/connectionSchema");

const viewConnectionRouter = express.Router();

viewConnectionRouter.get(
  "/view/request/connection",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      console.log(loggedInUser._id);

      // Find all connections where loggedInUser is the receiver and status is "interested"
      const connections = await Connection.find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
        .populate(
          "fromUserId", // to use .populate in connectionSchma must have ref .
          "firstName lastName age skills gender imgUrl"
        )
        .populate("toUserId",
           "firstName lastName age skills gender imgUrl");

      console.log(connections);
      res.status(200).json(connections);
    } catch (err) {
      console.error(err);
      res.status(500).send("ERROR: " + err.message);
    }
  }
);
viewConnectionRouter.get("/view/my/connections", userAuth, async (req, res) => {
    try{

        const loggedInUser = req.user;
        const connection = await Connection.find({
          $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" },
          ]
        }).populate("fromUserId","firstName lastName age gender skills imgUrl ").populate("toUserId","firstName lastName age gender skills imgUrl")
        const data =connection.map((row)=>row.fromUserId)
        res.status(200).json(data)
    }catch(err){
        res.status(404).send(`ERROR: `+ err.message)
    }
});

module.exports = viewConnectionRouter;
