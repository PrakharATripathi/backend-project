import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// database is another continent 
const connectDB = async () =>{
    try{
       const connect =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       console.log(`\n mongoose connect !! DB HOST :  ${connect.connection.host}`);
    //    console.log(connect)
    }catch (error){
        console.log("ERROR:" + error);
        process.exit(1)
    }
}

export default connectDB