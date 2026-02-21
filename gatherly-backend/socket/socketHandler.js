const { Message } = require('../models');

// Store connected users (socketId -> user info)
const connectedUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Join event room
        socket.on('join-event', async ({ eventId, username }) => {
            try {
                socket.join(eventId);
                connectedUsers.set(socket.id, { eventId, username });

                console.log(`${username} joined event room: ${eventId}`);

                const messages = await Message.find({ eventId })
                    .sort({ timestamp: 1 })
                    .limit(50);

                const formattedMessages = messages.map(msg => ({
                    id: msg._id,
                    message: msg.content,
                    username: msg.senderName,
                    timestamp: msg.timestamp
                }));

                socket.emit('previous-messages', formattedMessages);

                socket.to(eventId).emit('user-joined', {
                    message: `${username} joined the chat`,
                    username: 'System',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Error joining event:', error);
            }
        });

        socket.on('send-message', async ({ eventId, message, username, userId }) => {
            try {
                const messageData = {
                    eventId,
                    senderName: username,
                    content: message,
                    timestamp: new Date().toISOString()
                };

                if (userId) {
                    messageData.sender = userId;
                }

                const newMessage = await Message.create(messageData);

                io.to(eventId).emit('new-message', {
                    id: newMessage._id,
                    message: newMessage.content,
                    username: newMessage.senderName,
                    timestamp: newMessage.timestamp
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('typing', ({ eventId, username, isTyping }) => {
            socket.to(eventId).emit('user-typing', { username, isTyping });
        });

        socket.on('disconnect', () => {
            const userInfo = connectedUsers.get(socket.id);
            if (userInfo) {
                const { eventId, username } = userInfo;
                socket.to(eventId).emit('user-left', {
                    message: `${username} left the chat`,
                    username: 'System',
                    timestamp: new Date().toISOString()
                });
                connectedUsers.delete(socket.id);
            }
            console.log('User disconnected:', socket.id);
        });
    });

    // No mock event broadcasting anymore
    return () => { };
};
