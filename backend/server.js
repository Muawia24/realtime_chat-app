import express from 'express';

import dotenv from 'dotenv';
import path from 'path';
import process, { send } from 'process';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import router from './routes/index.js';
import db from './config/db.js';
import Message from './models/Message.js';
import { timeStamp } from 'console';
import { fileURLToPath } from 'url'

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', router);

await db.connect();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        //credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', async ({ username, room }) => {
        console.log(`${username} Joiend room: ${room}`)
        socket.join(room);
        console.log(`User: ${socket.id} joined room ${room}`);

        const messages = await Message.find({ room }).sort({ timestamp: 1 });
        socket.emit('previousMessages', messages);

        socket.to(room).emit('message', {
            sender: 'System',
            content: `${username} has joined the room`,
            room: room,
            timestamp: new Date(),
        });
    });

    socket.on('send_message', async (msg) => {
        io.to(msg.room).emit("receive_message", msg);
    });

    socket.on('delete_message', (messageId) => {
        socket.emit('delete_message1', messageId)
    });

    socket.on('leave_room', async ({ room, msg }) => {
        socket.leave(room);
        const savedMessage = await db.saveMessage(msg);
        console.log(`User ${savedMessage.username} left room ${room}`);
        // Notify other users in the room
        socket.to(room).emit('user_left', { savedMessage });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});
