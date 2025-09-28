const mongoose = require("mongoose");
mongoose.pluralize(null); // use it to avoid plural and lowercase  form in collection of db
const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the "User" model from userSchema  here , it is optional but when we use .populate() (learn) then it is necessary to use , however it is good practice to use it .
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // References the "User" model from userSchema  ,however we don't have to import user model in any components as mongodb stores every model globally.
      required: true,
    },
    status: {
      type: String,
      enum: ["ignored", "accepted", "rejected","interested"],// here mongoose will give its message if !=enum
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// indexing to work code fast whenever  searched for fromUserId and toUserId

connectionSchema.index({
  fromUserId: 1,
   toUserId: 1
  })

  // Prevent self-connection  .equals is used here as both fromUserId and toUserId are object none are String
connectionSchema.pre('save',function(next){
  const connection=this
  if(connection.fromUserId.equals(connection.toUserId)){
   /**  return new Error(`you can't send the connection request yourself...`) 
    *  return new Error (throw is not used with return ) next is using in same line only .  ...... but don't use it may cause problem. */
   return new Error(`you can't send the connection request yourself...`)
  }
  next()
  
})
const Connection = mongoose.model("Connection", connectionSchema);
module.exports = Connection;
