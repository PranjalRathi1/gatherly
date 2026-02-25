const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const {
  createEvent,
  getAllEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  deleteEvent,
  approveJoinRequest,
  rejectJoinRequest,
  getEventByCode
} = require('../controllers/eventController');

/* ===========================
   ROUTES
=========================== */

router.get('/', authMiddleware, getAllEvents);
router.get('/code/:joinCode', authMiddleware, getEventByCode);
router.get('/:id', authMiddleware, getEventById);

router.post('/', authMiddleware, createEvent);
router.post('/:id/join', authMiddleware, joinEvent);
router.post('/:id/leave', authMiddleware, leaveEvent);

router.post('/:id/approve/:userId', authMiddleware, approveJoinRequest);
router.post('/:id/reject/:userId', authMiddleware, rejectJoinRequest);

router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;