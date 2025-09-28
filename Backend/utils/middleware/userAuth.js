const User = require("../../models/userSchema")
const jwt=require(`jsonwebtoken`)
const userAuth =async(req,res,next)=>{
    try{
// onces user logged in and now to perform any action need some verification for the user , clicked on profile so 1st reed the token , 2nd verify it  , 3rd next()  wherever you place this userAuth perform that function 
  
// reading the token        
const {token} =req.cookies
if(!token){
    throw new Error(`Token is not present....`)
}

// verifing token 
 const SECRET_KEY=process.env.SECRET_KEY
  
  const decodedMsg= jwt.verify(token,SECRET_KEY)
  const {_id}=decodedMsg
  const issuedAt=decodedMsg.iat
  const expiredAt=decodedMsg.exp
  const user=await User.findById(_id)
  if(!user){
    throw new Error(`user is not found....`)
  }
// Attach user to req 
   req.user = decodedMsg;
   console.log(`userAuth component ->things gets attached in token along with userId(hidden in token) `)
   console.log("String and object with + will not give required ans " + req.user)
   console.log("with , " ,req.user)

   // iat = issuedAt , eat= expiredAt
   console.log("issuedAt  (iat)" +new Date(issuedAt *1000)) // in IST, 24 hr formate no am,pm.
   console.log("expiredAt  (eat)" +new Date(expiredAt *1000)) 

   console.log("issuedAt IST (iat) "+new Date(issuedAt*1000).toLocaleString("en-IN", {
   timeZone: "Asia/Kolkata"}))    // in 12hr formate with am and pm 

   console.log("expiredAt IST (eat)"+new Date(expiredAt*1000).toLocaleString("en-IN",{
    timeZone:"Asia/Kolkata",
    hour12: false} // in 24 hr
    ))
    console.log("...............................................................")
//    calling next to perform next function 
  next()

}catch(err){
    res.send(`ERROR:`+ err.message)
}
}
module.exports=userAuth