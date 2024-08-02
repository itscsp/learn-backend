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




export {app}