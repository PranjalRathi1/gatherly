import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import Message from './models/Message.js';
import UserEvent from './models/UserEvent.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages', messageRoutes);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch {
        next(new Error('Unauthorized'));
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.userId);

    socket.on('join_event_room', async (eventId) => {
        socket.join(eventId);
        try {
            await UserEvent.findOneAndUpdate(
                { user: socket.userId, event: eventId },
                { lastReadAt: new Date() },
                { upsert: true }
            );
        } catch (err) {
            console.error('Error updating lastReadAt:', err);
        }
    });

    socket.on('send_message', async ({ eventId, text }) => {
        const msg = await Message.create({
            event: eventId,
            sender: socket.userId,
            text,
        });

        io.to(eventId).emit('receive_message', {
            _id: msg._id,
            eventId,
            sender: socket.userId,
            text,
            createdAt: msg.createdAt,
        });
    });

    socket.on('typing', (eventId) => {
        socket.to(eventId).emit('typing', socket.userId);
    });

    socket.on('stop_typing', (eventId) => {
        socket.to(eventId).emit('stop_typing', socket.userId);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

export { server };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
