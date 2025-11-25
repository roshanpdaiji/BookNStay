import User from "../models/User.js";
import { Webhook } from "svix";
import connectDB from "../config/db.js";

const clerkWebhooks = async (req, res) => {
  try {
    await connectDB(); // ensure DB connection

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await whook.verify(req.body, headers); // verify payload

    const { data, type } = req.body; // already parsed

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`,
      image: data.image_url || "",
      role: "user",
      recentSearchedCities: "",
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.log("Webhook ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
