import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    hotel: { type: String, ref: 'Hotel', required: true },
    roomType: { type: String, required: true, trim: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

export default Room;

