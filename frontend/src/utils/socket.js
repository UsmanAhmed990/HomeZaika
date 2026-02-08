import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5020', {
    withCredentials: true
});

export default socket;
