import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'

//Create express app and HTTP Server
const app = express()
const server = http.createServer(app)



app.use(cors())

//middleware
app.use(express.json())
app.use(clerkMiddleware())

//API to listen to clerk webhooks
app._router.use("api/clerk",clerkWebhooks)


app.get('/',(req,res)=>res.send("API is working"))

//Connect to mongdb
await connectDB()

if(process.env.NODE_ENV !== "production"){
const PORT = process.env.PORT || 3000;
server.listen(PORT,()=>console.log("Server is running on PORT :" +PORT ))

}

//Export server fro vercel

export default server



