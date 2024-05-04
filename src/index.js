// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js';


dotenv.config({path:'./env'})

connectDB();










/*
// this is only for testing purposes
import express from 'express';
const app = express();

// const connectDb = async() =>{

// }

// connectDb();

; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("erorr", (error) => {
            console.log("somthing wrong in database");
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app start in port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR: " + error)
        throw error
    }
})()
*/
