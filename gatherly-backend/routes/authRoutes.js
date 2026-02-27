const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateProfile, requestCreatorRole, approveCreatorRequest, getPendingCreatorRequests, rejectCreatorRequest } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.put('/profile', authMiddleware, updateProfile);
router.post('/request-creator', authMiddleware, requestCreatorRole);
router.post('/approve-creator/:userId', authMiddleware, approveCreatorRequest);
router.get('/pending-creators', authMiddleware, getPendingCreatorRequests);
router.post('/reject-creator/:userId', authMiddleware, rejectCreatorRequest);
module.exports = router;


