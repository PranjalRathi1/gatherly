import mongoose from 'mongoose';

const messagePinSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index: one user can pin each message only once
messagePinSchema.index({ messageId: 1, userId: 1 }, { unique: true });

const MessagePin = mongoose.model('MessagePin', messagePinSchema);

export default MessagePin;
