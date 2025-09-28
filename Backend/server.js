const express = require("express");
const dotenv = require("dotenv"); // to extract from .env 
const DbConnct = require("./config/DbConnct");
const cookieParser=require(`cookie-parser`);
const router = require("./routes/aUSerRouter");
const viewProfileRoute = require("./routes/viewProfileRoute");
const editProfileRoute = require("./routes/editProfileRoute");
const infoRouter = require("./routes/infoRouter");
const forgotPassRouter = require("./routes/forgotPassRouter");
const sendRequestRouter = require("./routes/sendRequestRouter");
const viewConnectionRouter = require("./routes/viewConnectionRouter");
const cors =require('cors') // to connect frontend with backend




dotenv.config();  // npm i dotenv
const PORT = process.env.PORT; // fetching port from .env , to fetch anything from .env , install dotenv , import it , config it , initialize with same name.
const app = express();

app.use(cors({
  origin:"http://localhost:5174",   // frontend url
  credentials:true                  // to pass the cookie , to get cookie in frontend need some.,...check fronten
}))       
app.use(express.json()); // middleware use to convert json data from postman into js object
app.use(cookieParser()) //Automatically reads the Cookie header and makes cookies available in        req.cookies.

app.use("/", router)  // using this because now the routes or apis are in different files this connect with apis 
app.use("/",viewProfileRoute)
app.use("/",editProfileRoute)
app.use("/",infoRouter)
app.use("/",forgotPassRouter)
app.use('/',sendRequestRouter)
app.use('/',viewConnectionRouter)

const db = DbConnct(); // Is this a Promise?

// Check like this:
if (typeof db?.then === "function") {
  console.log("Returns a Promise");
}

DbConnct()
  .then(() => {
    console.log('DB connected')
    app.listen(PORT, () => {
      console.log(`App is listening at port ${PORT}`)
      
    });
  })
  .catch(err => console.error('DB connection error:', err));
  
  /**  can be done in this way (err) (err .. as it has only one line of code skip {}
   
    .catch((err) => {
    console.error('DB connection error:', err);
  });

  ** try...catch vs .then().catch() 
  1)  try...catch => 
    a) for synchronous code 
    b) with async code using await 
    c) wrap it in an async function if using one component in another component     .... example below 
    
 **                ------------In arrrow function------------

   const startServer= async()=>{      
  try {
    await DbConnct(); // now properly awaited
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`App is listening at port ${PORT}`);
    });
  } catch (err) {
    console.error('DB connection error:', err);
  }
 } 
 startServer();

   NOT FOR 
    a) async code using .then() example below ...
    b) one which return promise. .... how to check example above 
 
  
  try {
  fetch(...).then(...).catch(...);
} catch (err) {
  // ❌ This does NOT catch promise errors
}

  2)  .then().catch() => for asynchronous code 
     a)
           Mixing await and .then():

      ❌ Adds complexity.

       ❌ Makes code harder to read.

       ❌ Can cause logic errors if not handled carefully.
       
     b) rest check in NOT in try...catch.
  
  */

