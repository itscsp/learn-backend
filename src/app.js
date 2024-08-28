import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// This will limit how much data should enter in your server per request.
app.use(express.json({limit: "16kb"})) 

//To convert URL link (example: url+string%20string)
app.use(express.urlencoded({extended:true, limit:"16kb"}))

// Store files
app.use(express.static('public'))

// To perform CRUD Operation in Cookies in browser
app.use(cookieParser())



//Import routers
import userRouter from "./routes/user.router.js"

// routes declaration
app.use("/api/v1/users", userRouter)

//https://localhost:8000/api/v1/user/register

export {app}