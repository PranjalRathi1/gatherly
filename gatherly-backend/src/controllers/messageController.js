import Message from '../models/Message.js';
import UserEvent from '../models/UserEvent.js';

export const getMessages = async (req, res) => {
    try {
        const msgs = await Message.find({ event: req.params.eventId })
            .sort({ createdAt: 1 })
            .populate('sender', 'name');

        res.json({ success: true, data: msgs });
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getUnreadCounts = async (req, res) => {
    try {
        const userId = req.user._id;
        const userEvents = await UserEvent.find({ user: userId });

        const unreadData = await Promise.all(userEvents.map(async (ue) => {
            const count = await Message.countDocuments({
                event: ue.event,
                createdAt: { $gt: ue.lastReadAt }
            });
            return { eventId: ue.event, unreadCount: count };
        }));

        res.json({ success: true, data: unreadData });
    } catch (error) {
        console.error('Get Unread Counts Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const getEventMessages = getMessages;

export const pinMessageGlobally = async (req, res) => {
    try {
        const { id } = req.params;

        // Unpin all first (global pin = only one)
        await Message.updateMany({}, { pinned: false });

        const msg = await Message.findByIdAndUpdate(
            id,
            { pinned: true },
            { new: true }
        );

        if (!msg) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.json({ success: true, data: msg });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
