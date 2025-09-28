const express = require("express");
const validateSignUp = require("../utils/validateSignUp");
const bcrypt = require("bcrypt"); // for hashing the password
const User = require("../models/userSchema");
const ms = require("ms"); // convert number in miliseconds used in cookie -> maxAge.
const userAuth = require("../utils/middleware/userAuth");

/**  ##  to use routes here(not in server.js) need some things extra rest will remain same 
1. must have to use const router = express.Router()   ** router ( return it,if there is arrow function) (if no arrow function no return just export it )

if (no arrow function created below example){
    1. const router = express.Router(); file name===router
    2. module.exports= router
    3. in server.js app.use("/",router)
}

if (arrow function created with userEnteryRoutes name){
   1. must  return router(the one which is attached with express.Router) at the last 
   2. must module.exports= userEnteryRoutes.
   3. in server.js app.use("/",userEntryRoutes()) must use()
}

check profileRoute for clearenes.
*/

/**
 * console.log(`string` + someString) => ans... string someString
 * console.log(`string` + someObject) => ans... string [object]
 * console.log(`string` , someObject) => ans... string someObject
 */
const router = express.Router();

//creating a new instence of user model
router.post("/signUp", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      phoneNumber ,
      skills ,
      gender,
      imgUrl = "",
    } = req.body; // must have those fields that have required in schema else will throw error ..... phoneNumber should be String

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      throw new Error(`user is already present`);
    }

    /** if (email === User.email) {
  throw new Error(`user is already present`)
}
1. User is a Mongoose model, not an individual user document.
2. User.email tries to access a static email property on the model, which doesn't exist.
 */

    //validate
    validateSignUp(req);

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      // pass the one you want to save (must be present in schema) , if anything absent or some random value will be ignored.
      firstName,
      lastName,
      password: hashPassword,
      email,
      phoneNumber,
      skills,
      gender, // if adding some field here but skip to extract from req.body then it will throw an error failed to save new usergender is not defined
      imgUrl,
    });
    await user.save();
    const token = await user.getJWT(); // calling generated token (token generated at userSchema)
    res.cookie("token", token, {
      // 2 times token 1st = name of cookies 2nd value assigning to the cookie
      maxAge: ms("2.5h"), //Readme
    });
    console.log(`new user`, user);
    res.status(201).send({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).send(`ERROR ` + err.message);
  }
});

// signIn
//  here we have checked email and password , hashed password  -> created token , stored in cookie
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`Email not valid`);
    }
    const isPassword = await user.verifyPassword(password); // calling verified password (from userSchema )
    if (isPassword) {
      const token = await user.getJWT(); // calling generated token (token generated at userSchema)
      res.cookie("token", token, {
        // 2 times token 1st = name of cookies 2nd value assigning to the cookie
        maxAge: ms("2.5h"), //Readme
      });
      res.status(200).json({ message: `login successfull`, data: user });
    } else {
      throw new Error(` password not valid`);
    }
  } catch (err) {
    res.send(`ERROR:` + err.message);
  }
});

// logout api => just clear the cookie
router.post("/logout", userAuth, async (req, res) => {
  res.cookie("token", null, {
    maxAge: 0, // immediately expire the cookie
  });
  const loggedInUser =
    req.user; /**    we have added userAuth middleware so once user logged in token generated that has (userId hidden) and in userAuth we are attaching user's id 
    
    const email=req.user.email 
      console.log(email)

     *     => we can't only userId is hidden in token to get email directly hide email  also like  
    
   const token = jwt.sign(
   { _id: user._id, email: user.email },
   process.env.JWT_SECRET,
    */

  const user = await User.findById(loggedInUser._id);
  res.status(200).json({ message: `${user.firstName} logout ` });
});

// delete any user by id
router.delete(`/deleteAnyUser/:userId/`, userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const user = await User.findById(loggedInUser._id);
  const toDeleteUserId = req.params.userId; /**
  a) if no check on userId then anyone can delete any user.
       flow -> userAuth -> check and validate the token for loggedIn user -> now check user from userId in url and delete that user (anyone can delete any user)-> synchronous code  
  b)  req.params => anything u pass with url will come under params (/:) here   {router.delete(`/delete/:userId/:firstName`,userAuth, async (req, res) => }   userId and firstName is passed so params will have both ,, must provide userId and firstName with url while deleting user */
  console.log(req.params);
  try {
    const deleteUser = await User.findByIdAndDelete(toDeleteUserId);
    if (!deleteUser) {
      throw new Error(`no user found to delete `);
    }

    console.log(
      ` ${user.firstName} deleted ${deleteUser.firstName} sucessfully whose id is ${toDeleteUserId} `
    );

    res.send(
      ` ${user.firstName} deleted ${deleteUser.firstName} sucessfully whose id is ${toDeleteUserId} `
    );
  } catch (err) {
    res.status(500).send(`Error deleting user: ${err.message}`);
    console.error(`error`);
  }
});

// delete own id
router.delete("/deleteOwnId", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const user = await User.findByIdAndDelete(loggedInUser._id);
  // if(!user) return res.send(`no user to delete`)  .... not necessary to verify user here .. it will be done by userAuth
  console.log(`${user.firstName}'s id deleted sucessfully `);
  res.send(`${user.firstName}'s id deleted sucessfully `);
});

module.exports = router;
