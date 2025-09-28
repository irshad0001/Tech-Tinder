const express =require("express");
const User = require("../models/userSchema");
const userAuth = require("../utils/middleware/userAuth")
const editProfileRoute=express.Router()
//updating  : can use either patch (Updates only the fields you send, rest unchanged) or put (Replaces the entire resource with a new version. You typically send all fields, even those that haven’t changed.If you omit a field, it may be deleted or reset.)
editProfileRoute.patch("/update/",userAuth,async (req, res) => {
  try {
     const loggedInUser=req.user._id             

     const data = req.body;        // Used for the actual update in the database
     console.log("data(string) +(object)"+ data) //in js "some string" + object = X
     console.log("data ", data)  // in js "some string" + object = X

     const {...updateData } = req.body;  
     console.log(" updateData ", updateData)           
                                  /**  
                                   * "SHALLOW COPY OF REQ.BODY" (THE DATA ALREADY PRESENT IN DB -> any changes made doesn't reflect in db , need to change in data =req.body for actuall change to happen ) if this was there --> { userId,...updateData } it means place userId in userId and rest of the schema's value in updateData(params)
                                   but {...updateData } it means put all data's value in updateData.
                                   * Why shallow coping => It's a best practice to avoid mutating incoming request objects directly. 
                                   */

    const updateAllowed = ["firstName","lastName", "gender", "skills" ,"imgUrl" ,"age" ,"phoneNumber"];
    const isUpdate = Object.keys(updateData).every((k) => updateAllowed.includes(k)); 
                                                 

    if (!isUpdate) {
      throw new Error("Updates not allowed");
    }
    

    if (data.skills?.length > 5) {
      throw new Error("Skills cannot be more than 5");
    }

    const user = await User.findByIdAndUpdate(loggedInUser, data, {
      runValidators: true,
      new: true,                                      // it will print new value in console after update , else will print older value after updates.
    });

    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log(user)
    res.send("User updated successfully");
  } catch (err) {
    console.error("Error occurred:", err.message);
    res.status(400).send(`Update failed: ${err.message}`);
  }
});
module.exports=editProfileRoute