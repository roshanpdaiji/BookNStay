import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/db.js'
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js'
import bodyParser from 'body-parser' 
import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'

// Initialize DB
await connectDB();

////Connect cloudinary
connectCloudinary();

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

app.use('/api/user',userRouter)
app.use('/api/hotels',hotelRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/bookings',bookingRouter)

// const PORT = process.env.PORT || 3000;

// app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))



// Export for Vercel
export default app


