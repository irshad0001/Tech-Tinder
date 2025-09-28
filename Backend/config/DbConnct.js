const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const MONGO_URL=process.env.MONGO_URL
const DbConnct = async()=>{
await mongoose.connect(MONGO_URL)
}
module.exports = DbConnct