import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    // NOTE: Event types are lowercase to ensure API consistency.
    // Frontend must map constants (e.g., CONCERT -> 'concert')
    type: {
        type: String,
        enum: ['concert', 'travel', 'trek', 'meetup'],
        required: [true, 'Please specify event type']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
eventSchema.index({ type: 1 });
eventSchema.index({ date: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;
