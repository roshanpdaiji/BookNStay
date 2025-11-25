import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import bodyParser from 'body-parser' // Import this

// Initialize DB
await connectDB()

const app = express()
app.use(cors())

// --- FIX START ---
// 1. Apply Clerk Middleware
app.use(clerkMiddleware())

// 2. specific route for Webhook using RAW body parser
// We force the body to be a Buffer so svix can verify the signature accurately
app.post("/api/clerk", bodyParser.raw({ type: 'application/json' }), clerkWebhooks)

// 3. Global JSON parser for all other routes
app.use(express.json())
// --- FIX END ---


app.get('/', (req, res) => res.send("API is working"))

// Export for Vercel
export default app