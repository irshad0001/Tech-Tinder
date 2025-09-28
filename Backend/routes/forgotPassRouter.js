const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const userAuth = require("../utils/middleware/userAuth");
const validator = require('validator')

const forgotPassRouter = express.Router();

  forgotPassRouter.patch("/forgotPassword", userAuth, async (req, res) => {
    try{
      const loggedInUser=req.user
      const {password}=req.body
      /**
       * To extract data from req.body
       * 
       * 1) const data=req.body => will give whole data from req.body in {key:value}
       * 1.a) const {password}=data
       * 2) const {password}=req.body => only password eg-> Takima@7
       * 3) const password=req.body.password =>Takima@7
       * !) XX const password=req.body xx ERROR: inspite of only one {key:value} in req.body
       */
      console.log(data)
      // const password=data.password

      // validateSignUp(req) --> can't do this as it will check for all thing in validateSignUp
      if (!validator.isStrongPassword(password)) {
            console.log(`password`,password)
          throw new Error("Password is not strong enough");
        }
      const hashPassword=await bcrypt.hash(password,10)
      

      const user=await User.findByIdAndUpdate(
        loggedInUser._id,
        {password:hashPassword},
        {
        runValidators:true,
        new:true
      })
      
      console.log("Your new password is  " + password)
      res.send("Your new password is  " + password)
      await user.save()

    }catch (err) {
      console.error("Error updating password:", err.message, err.stack); // console.log->same effect ...
      res.status(404).send(" ERROR: " + err.message);
    }
  });


module.exports = forgotPassRouter;
