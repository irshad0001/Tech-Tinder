const express=require("express");
const User = require("../models/userSchema");
const userAuth = require("../utils/middleware/userAuth");
const infoRouter=express.Router()

// find user with lastName
infoRouter.get(`/user`,userAuth, async (req, res) => {
  try {
    const user = await User.find({ lastName: req.body.lastName }); // instead of const lastname=req.body
    console.log(user);
    if (!user) {
      res.status(404).send(`user not found`);
    } else {
      res.send(user);
    }
  } catch (err) {
    console.error(`user not found`, err);
  }
});

// find all user
infoRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Server error");
  }
});
module.exports =infoRouter
