import { io } from 'socket.io-client';

const socket = io('http://localhost:5020', {
    withCredentials: true
});

export default socket;
