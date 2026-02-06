import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    autoConnect: false,
});

const socketService = {
    socket,

    connect(token) {
        socket.auth = { token };
        if (!socket.connected) socket.connect();
    },

    disconnect() {
        if (socket.connected) socket.disconnect();
    },

    on(event, cb) {
        socket.on(event, cb);
    },

    off(event, cb) {
        socket.off(event, cb);
    },

    emit(event, payload) {
        socket.emit(event, payload);
    },
};

export default socketService;
