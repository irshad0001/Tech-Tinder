const express = require("express");
const userAuth = require("../utils/middleware/userAuth");
const User = require("../models/userSchema");
const Connection = require("../models/connectionSchema");
const viewProfileRoute = express.Router();

viewProfileRoute.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser._id);
    if (!user) {
      throw new Error(`user not found`);
    }
    console.log(user.firstName + ` logged in`);
    res.status(200).json({message:`${user.firstName} logged In`,data:user})
  } catch (err) {
    
    res.send(`ERROR:` + err.message);
  }
});
viewProfileRoute.get("/connection/feed", userAuth, async (req, res) => {
  try {
    /**  pagenation.  4 lines here 2 lines after .select()
     * page 1 -> .skip(0).limit(10)    users 1-10
     * page 2 -> .skip(10).limit(10)   users 11-20
     * page 3 -> .skip(20).limit(10)   users 21-30
     * page 4 -> .skip(30).limit(10)   users 31-40
     */
    const page=parseInt(req.query?.page)||1 // query means now in url /connection/feed?page=1&limit=2(now u manually limiting user if limit exceeded then limit=10)
    let limit =parseInt(req.query?.limit)||10
    const skip=(page-1)*limit
    limit>20?20:limit                             
    const loggedInUser = req.user; // Ben10 loggedIn

    /** Step 1:
     *  a)  Get only connections involving the logged-in user
     *  b) .lean() is used to make it return plain JavaScript objects (not full Mongoose documents), which is faster and lighter.
     *  c) we got userId in object form along with other info in 	userConnections in array of objects, now raw IDs need to convert it into string using loop
     */
    const userConnections = await Connection.find({ //will get whole document for..
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).lean();
    console.log(userConnections) // documents of Pokemon->Ben10 , Doreamon->Ben10 ,Chota->Ben10.

    // Step 2: Collect all connected user IDs (other than self)
    const connectedUserIds = new Set();

    userConnections.forEach((conn) => {
      if (conn.fromUserId.toString() !== loggedInUser._id.toString()) {
        connectedUserIds.add(conn.fromUserId.toString());
      }
      if (conn.toUserId.toString() !== loggedInUser._id.toString()) {
        connectedUserIds.add(conn.toUserId.toString());
      }
    });
    console.log(connectedUserIds) // only userId of Pokemon, Doreamon, Chota

    /** Step 4: Find users not in the connected set . 
    $nin: = not in, $in: = in , $ne: = not equal
    MongoDB needs an array, not a Set. Array.from() to convert it into an array.*/
    const usersToShow = await User.find({
      $and: [
        { _id: { $nin: Array.from(connectedUserIds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName lastName age gender email skills phoneNumber imgUrl")
    .skip(skip)
    .limit(limit) 
    // now no need of if()...else()  no data no userToShow 
      res.status(200).json({
        message: "Suggested users",
        data: usersToShow,
      });
    
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

/** Performing side effects(+ ,-,* etc )	      forEach()
    Building new arrays	                        map() */
module.exports = viewProfileRoute;
