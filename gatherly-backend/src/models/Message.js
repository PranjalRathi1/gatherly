import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    pinned: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
