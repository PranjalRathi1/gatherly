import express from 'express';
import { generateUploadUrl } from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/chat-image', protect, generateUploadUrl);

export default router;
