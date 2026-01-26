import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an event title']
    },
    description: {
        type: String,
        required: [true, 'Please provide an event description']
    },
    date: {
        type: String,
        required: [true, 'Please provide an event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide an event time']
    },
    location: {
        type: String,
        required: [true, 'Please provide an event location']
    },
    category: {
        type: String,
        required: [true, 'Please provide an event category']
    },
    image: {
        type: String,
        default: ''
    },
    host: {
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

const Event = mongoose.model('Event', eventSchema);

export default Event;
