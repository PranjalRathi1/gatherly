import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token (exclude password)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        // Attach user to socket
        socket.user = user;
        next();
    } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
    }
};
