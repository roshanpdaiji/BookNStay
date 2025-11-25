import User from "../models/User.js";
import { Webhook } from "svix";
// Removed: connectDB import and call. It should be in the main server file for performance.

const clerkWebhooks = async (req, res) => {
  try {
    // --- ⚠️ CRITICAL NOTE ---
    // Webhook verification REQUIRES the raw request body. 
    // This controller assumes the raw body has been passed via the middleware chain.
    const rawBody = req.rawBody; // Will be available if middleware is set up correctly (see below)

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Use the rawBody for verification
    const payload = whook.verify(rawBody, headers); 

    const { data, type } = payload; // Get data from the verified payload

    // Construct the user data object
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      // Fix: Ensure a space is only included if both names exist
      username: (data.first_name && data.last_name) ? `${data.first_name} ${data.last_name}` : (data.first_name || data.last_name || data.username),
      image: data.image_url || "",
      role: "user",
      recentSearchedCities: "",
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        // ✅ FIX: Added { new: true, runValidators: true } for successful update
        await User.findByIdAndUpdate(data.id, userData, { new: true, runValidators: true });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    // Success response should be HTTP 200/202 for webhooks
    res.status(200).json({ success: true, message: "Webhook Received" });
  } catch (error) {
    // If verification fails, Svix throws an error.
    console.error("Webhook Verification or Database Error:", error.message);
    res.status(400).json({ success: false, message: "Invalid Webhook Signature or Processing Error." });
  }
};

export default clerkWebhooks;