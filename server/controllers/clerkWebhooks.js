import User from '../models/User.js'
import { Webhook } from 'svix'

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // --- FIX: Handle Raw Body ---
        // req.body is now a Buffer because of bodyParser.raw() in index.js
        const payload = req.body.toString();
        
        // Verify Payload (This will throw an error if signature is invalid)
        await whook.verify(payload, headers)

        // Parse the JSON manually after verification passes
        const evt = JSON.parse(payload);
        const { data, type } = evt; 

        // Construct User Data
        // specific handling depending on event type to avoid undefined errors
        const userData = {
            _id: data.id,
            email: data.email_addresses?.[0]?.email_address || "",
            username: data.first_name ? `${data.first_name} ${data.last_name}` : "User",
            image: data.image_url || "",
            recentSearchedCities: "" 
        }

        // Switch cases
        switch (type) {
            case "user.created": {
                await User.create(userData)
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData)
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id)
                break;
            }
            default:
                break;
        }

        res.json({ success: true, message: "Webhook Received" })

    } catch (error) {
        console.log("Webhook Error:", error.message);
        // --- FIX: Return error status ---
        // Respond with 400 so Clerk knows to retry or mark as failed
        res.status(400).json({ success: false, message: error.message })
    }
}

export default clerkWebhooks