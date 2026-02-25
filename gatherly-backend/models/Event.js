const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: 50
  },
  category: {
    type: String,
    enum: ['concert', 'travel', 'trekking'],
    default: 'concert'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },

  joinCode: {
    type: String,
    default: null
  },

  joinRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]


}, {
  timestamps: true
});

// Add indexes for performance
eventSchema.index({ location: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });


module.exports = mongoose.model('Event', eventSchema);
