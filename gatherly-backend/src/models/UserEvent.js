import mongoose from 'mongoose';

const userEventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    lastReadAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure a user can only have one entry per event
userEventSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('UserEvent', userEventSchema);
