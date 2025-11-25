import User from '../models/User.js'
import { Webhook } from 'svix'

const clerkWebhooks = async (req,res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // The raw request body is now in req.body because we used express.raw()
        // Convert the buffer to a string for verification.
        const payload = req.body.toString(); 

        //Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // Verifying Headers with the RAW payload
        const svixEvent = await whook.verify(payload, headers);

        // Parse the body ONLY AFTER verification
        // Svix returns the parsed event body from verify, use that.
        const { data, type } = svixEvent; // Use the verified and parsed body

        // ... rest of your controller logic (it looks correct for data extraction) ...
        const userData = {
             _id: data.id,
             email: data.email_addresses[0].email_address,
             username: data.first_name + "" + data.last_name,
             image: data.image_url,
        }

        //Switch cases for different events (This logic is correct)
        switch (type) {
            case "user.created": {
                await User.create(userData)
                break;
            }
            case "user.updated": {
                // Ensure you pass { new: true } if you want the updated document back,
                // though for webhooks, a simple update is fine.
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

        res.json({success:true,message:"Webhook Received"})

    } catch (error) {
        // ... error handling ...
    }
}

export default clerkWebhooks