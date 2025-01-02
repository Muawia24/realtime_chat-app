import process, { send } from 'process';
import http from 'http';
import db from './config/db.js';
import app from './app.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import socketHandlers from './socketHandler.js';


const PORT = process.env.PORT || 5000;

dotenv.config();

// Initialies the Monogdb connection
await db.connect();

// Http server
const server = http.createServer(app);

// set up the real-time messaging socket
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        //credentials: true
    }
});

// Handles the real-time messages
socketHandlers(io);

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});