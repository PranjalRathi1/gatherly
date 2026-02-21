import express from 'express';
import {
    getEvents,
    getEventsByType,
    getEventById,
    createEvent,
    joinEvent,
    leaveEvent
} from '../controllers/eventController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/type/:type', getEventsByType);
router.get('/:id', getEventById);

router.post('/', protect, createEvent);
router.post('/:id/join', protect, joinEvent);
router.post('/:id/leave', protect, leaveEvent);

export default router;
