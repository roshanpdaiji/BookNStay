// --- Start of app.js ---
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'

// Initialize the database connection.
await connectDB()

const app = express()
app.use(cors())

// General Middleware Setup
// NOTE: We need a special setup for webhooks to get the raw body.

// 1. Webhook Route Setup (Must be FIRST to get the raw body)
// We use a body parser that stores the raw body, and NO clerkMiddleware or express.json().
app.post(
  "/api/clerk",
  express.raw({ type: 'application/json' }), // Middleware to get the raw body buffer
  clerkWebhooks
);

// 2. Standard Middleware (Applied to ALL other routes)
// Apply the JSON parser and Clerk middleware only AFTER the raw webhook route.
app.use(express.json());
app.use(clerkMiddleware());

// Basic Test Route
app.get('/', (req, res) => res.send("API is working"))

// ... (Remove app.listen block for Vercel) ...

// --- Serverless Export ---
export default app
// --- End of app.js ---