import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js' // Ensure this path is correct
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js' // Ensure this path is correct


// This runs once when the serverless function cold-starts.
await connectDB() 

// Initialize the database connection.

const app = express()
app.use(cors())

// General Middleware
// NOTE: For webhooks, sometimes the raw body is needed for signature verification.
// Ensure your 'clerkWebhooks' router/middleware is set up to handle the raw body 
// if necessary (Clerk's middleware often handles this requirement automatically).
app.use(express.json())
app.use(clerkMiddleware())

// API to listen to clerk webhooks
// FIX: Using the standard Express routing method: app.use()
app.post("/api/clerk", clerkWebhooks)

// Basic Test Route
app.get('/', (req, res) => res.send("API is working"))



if(process.env.NODE_ENV !=="production"){
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
}


// --- Serverless Export (CRITICAL FIX) ---
// We REMOVE the entire app.listen() block.
// Instead, we export the Express application instance so Vercel can handle the HTTP listening.
export default app

