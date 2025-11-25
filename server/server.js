import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB();

const app = express();
app.use(cors());
app.use(clerkMiddleware());

// 🛑 REMOVE express.json() BEFORE THE WEBHOOK ROUTE

// ✔ RAW BODY ONLY FOR CLERK WEBHOOK
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// ✔ After webhook -> NOW use express.json()
app.use(express.json());

// Test Route
app.get('/', (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
