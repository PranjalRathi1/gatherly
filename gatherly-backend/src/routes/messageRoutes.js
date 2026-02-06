import express from 'express';
import {
    getMessages,
    getUnreadCounts,
    pinMessageGlobally,
} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get unread counts for all events
router.get('/unread/counts', protect, getUnreadCounts);

// Get message history
router.get('/:eventId', protect, getMessages);

// Pin message (FIX 2)
router.post('/pin/:id', protect, pinMessageGlobally);

export default router;
