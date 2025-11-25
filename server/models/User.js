import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'hotelOwner'], default: 'user' },
    recentSearchedCities: { type: String, default: "" }, // Added default
}, { timestamps: true });

// Check if model exists before compiling to prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;