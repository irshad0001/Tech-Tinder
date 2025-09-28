const mongoose=require('mongoose')  // this is required 
const validator = require('validator'); // for validation 
const dotenv = require("dotenv"); // extracting value from .env 
const jwt=require('jsonwebtoken') // for creating token 
const bcrypt=require("bcrypt")  //for comparing password

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim: true,
    },
    lastName:{
        type:String,
        trim: true,
    },
     phoneNumber: {
    type: String, // String becz validating phoneNumber on validateSignUp with the help of validator (that accept phoneNumber as a String)
    unique: true,
    trim: true
  },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Email is not correct..")
        //     }
        // }
    },
    gender:{
      type:String,
      enum:{ // enum -> for validation works only in schema  , nothing to install 
        values:[`male`,`female`],  // values must be plural 
        message:`{VALUE} is not a valid gender`  
        /** {VALUE} must be in capital letter ..... u r showing own message .. if want system message -> check connectionSchema 
         * use enum -> when validating easy things doesn't require regex .
         * validate -> when require some regex.*/ 
      },
    //   validate(value){
    //     if(!["male","female"].includes(value)){                    // there is no such direct gender validation so we have to use the logic like this ...
    //         throw new Error(`gender is not valid`)}
    //   }
    },
    skills:{
        type:[String] // array of skills can have multiple.
    },
    password:{
        type:String,
        required:true,
         /**validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong")
            }
        },        .....................    never validate in schema level as it will validate the hashed password not the plane one        */    
    },
    imgUrl:{
        type:String,
        default:"https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
    },
    age:{
        type:Number
    }

},
{timestamps: true,  // automatically create ,createdAt and updatedAt. 
versionKey:false}) //mongodb automatically add at last __v:0 (version key = internal versioning of documents) set false to disable.

// indexing for faster quaries (searching)
userSchema.index({
    firstName:1,
    lastName:1,
})
 
const SECRET_KEYs=process.env.SECRET_KEY
userSchema.methods.getJWT=async function(){
    const user=this
    const token =jwt.sign({ _id: user._id }, SECRET_KEYs,  // hiding userId , anytime we can extract userId and with that a whole user's info 
        {
            expiresIn: `7d`   // can have "60" (interpreted as seconds),  "2d" (2 days),  "10m" (10 minutes),  "7d" (7 days),  "1y" (1 year) .... but cannot support fraction no like 2.5hrs
            
        }
    )
    return token
}
userSchema.methods.verifyPassword=async function(passwordInputByUser){
    const user = this 
    const isPassword= await bcrypt.compare(passwordInputByUser,user.password)
    return isPassword
}

const User=mongoose.model(`User`,userSchema) // const User (capital)
module.exports=User