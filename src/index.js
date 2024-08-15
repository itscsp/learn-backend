// require('dotenv').config({path: './env'}) //we can like this but not ideal syntax
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    // If we get error in express server
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
    // Listing to port
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is runing at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection failed !!!", err);
  });

/*
import express from "express"
const app = express()

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) => {
            console.log("ERROR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () =>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch  (error) {
        console.log("ERROR: ", error)
        throw err
    }
})()

*/
