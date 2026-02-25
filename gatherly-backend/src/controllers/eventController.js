import Event from '../models/Event.js';
import UserEvent from '../models/UserEvent.js';
import mongoose from 'mongoose';

/* =========================
   GET ALL EVENTS
========================= */
// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Get Events Error:', error);

        // IMPORTANT: Always return array
        res.status(200).json({
            success: false,
            data: []
        });
    }
};

/* =========================
   GET EVENTS BY TYPE
========================= */
// @desc    Get events by type
// @route   GET /api/events/type/:type
// @access  Public
export const getEventsByType = async (req, res) => {
    try {
        const { type } = req.params;
        const validTypes = ['concert', 'travel', 'trek', 'meetup'];

        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event type'
            });
        }

        const events = await Event.find({ type }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        console.error('Get Events By Type Error:', error);

        res.status(200).json({
            success: false,
            data: []
        });
    }
};

/* =========================
   GET EVENT BY ID
========================= */
// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name avatar')
            .populate('participants', 'name avatar');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Get Event By ID Error:', error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/* =========================
   CREATE EVENT
========================= */
// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
    try {
        const { title, description, type, location, date } = req.body;

        if (!title || !description || !type || !location || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const validTypes = ['concert', 'travel', 'trek', 'meetup'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event type'
            });
        }

        const event = await Event.create({
            title,
            description,
            type,
            location,
            date,
            createdBy: req.user._id,
            participants: [req.user._id] // creator auto-joined
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Create Event Error:', error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/* =========================
   JOIN EVENT
========================= */
// @desc    Join event
// @route   POST /api/events/:id/join
// @access  Private
export const joinEvent = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (event.participants.some(
            id => id.toString() === req.user._id.toString()
        )) {
            return res.status(400).json({
                success: false,
                message: 'User already joined this event'
            });
        }

        event.participants.push(req.user._id);
        await event.save();

        // Create UserEvent entry for tracking lastReadAt (Step 7)
        try {
            await UserEvent.findOneAndUpdate(
                { user: req.user._id, event: event._id },
                { lastReadAt: new Date() },
                { upsert: true }
            );
        } catch (err) {
            console.error('Error creating UserEvent on join:', err);
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Join Event Error:', error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/* =========================
   LEAVE EVENT
========================= */
// @desc    Leave event
// @route   POST /api/events/:id/leave
// @access  Private
export const leaveEvent = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        if (!event.participants.some(
            id => id.toString() === req.user._id.toString()
        )) {
            return res.status(400).json({
                success: false,
                message: 'User has not joined this event'
            });
        }

        event.participants = event.participants.filter(
            id => id.toString() !== req.user._id.toString()
        );

        await event.save();

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Leave Event Error:', error);

        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

