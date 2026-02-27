const { Event } = require('../models');
const { User } = require('../models');

/* =====================================================
   CREATE EVENT
===================================================== */
const createEvent = async (req, res) => {
  try {

    // 🔐 CHECK USER ROLE
    const user = await User.findById(req.userId);

    if (!user || (user.role !== 'creator' && user.role !== 'admin')) {
      return res.status(403).json({
        message: 'You are not authorized to create events'
      });
    }

    const {
      title,
      description,
      date,
      location,
      maxAttendees,
      category,
      visibility,
      joinCode,
      imageUrl
    } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxAttendees: maxAttendees || 50,
      category: category || 'concert',
      creator: req.userId,
      attendees: [req.userId],
      visibility: visibility || 'public',
      joinCode: visibility === 'private' ? joinCode : null,
      imageUrl: imageUrl || '',
      joinRequests: []
    });

    await event.populate('creator', 'username email');
    await event.populate('attendees', 'username email');

    res.status(201).json(event);

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ALL EVENTS
===================================================== */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { visibility: 'public' },
        { creator: req.userId },
        { attendees: req.userId }
      ]
    })
      .populate('creator', 'username email')
      .populate('attendees', 'username email');

    res.json(events);

  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET EVENT BY ID
===================================================== */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'username email')
      .populate('attendees', 'username email')
      .populate('joinRequests', 'username email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);

  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   JOIN EVENT
===================================================== */
const joinEvent = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.some(id => id.toString() === req.userId)) {
      return res.status(400).json({ message: 'Already attending this event' });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    if (event.visibility === 'public') {
      event.attendees.push(req.userId);
      await event.save();
    } else {
      if (joinCode && joinCode === event.joinCode) {
        event.attendees.push(req.userId);
        await event.save();
      } else {
        if (!event.joinRequests.some(id => id.toString() === req.userId)) {
          event.joinRequests.push(req.userId);
          await event.save();
        }

        await event.populate('creator', 'username email');
        await event.populate('attendees', 'username email');
        await event.populate('joinRequests', 'username email');

        return res.json({
          message: 'Join request sent. Awaiting approval.',
          event
        });
      }
    }

    await event.populate('creator', 'username email');
    await event.populate('attendees', 'username email');
    await event.populate('joinRequests', 'username email');

    res.json({
      message: 'Joined successfully',
      event
    });

  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   APPROVE JOIN REQUEST
===================================================== */
const approveJoinRequest = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!event.joinRequests.some(uid => uid.toString() === userId)) {
      return res.status(400).json({ message: 'No such join request' });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(userId);
    event.joinRequests = event.joinRequests.filter(
      uid => uid.toString() !== userId
    );

    await event.save();

    await event.populate('creator', 'username email');
    await event.populate('attendees', 'username email');
    await event.populate('joinRequests', 'username email');

    res.json({
      message: 'Join request approved successfully',
      event
    });

  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   REJECT JOIN REQUEST
===================================================== */
const rejectJoinRequest = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.joinRequests = event.joinRequests.filter(
      uid => uid.toString() !== userId
    );

    await event.save();

    await event.populate('creator', 'username email');
    await event.populate('attendees', 'username email');
    await event.populate('joinRequests', 'username email');

    res.json({
      message: 'Join request rejected successfully',
      event
    });

  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   LEAVE EVENT
===================================================== */
const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // 🔍 DEBUG LOGS (KEPT EXACTLY AS YOU HAD THEM)
    console.log("====== LEAVE DEBUG ======");
    console.log("req.userId:", req.userId);
    console.log(
      "attendees:",
      event.attendees.map(a => a.toString())
    );
    console.log("=========================");

    if (!event.attendees.some(id => id.toString() === req.userId)) {
      return res.status(400).json({ message: 'You are not attending this event' });
    }

    event.attendees = event.attendees.filter(
      id => id.toString() !== req.userId
    );

    await event.save();

    await event.populate('creator', 'username email');
    await event.populate('attendees', 'username email');
    await event.populate('joinRequests', 'username email');

    res.json({
      message: 'Left event successfully',
      event
    });

  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   DELETE EVENT
===================================================== */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET EVENT BY JOIN CODE
===================================================== */
const getEventByCode = async (req, res) => {
  try {
    const event = await Event.findOne({
      joinCode: req.params.joinCode,
      visibility: 'private'
    })
      .populate('creator', 'username email')
      .populate('attendees', 'username email');

    if (!event) {
      return res.status(404).json({ message: 'Invalid join code' });
    }

    res.json(event);

  } catch (error) {
    console.error('Get by code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent,
  approveJoinRequest,
  rejectJoinRequest,
  getEventByCode
};