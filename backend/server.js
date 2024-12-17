import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.log(err));

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

    socket.on('send_message', (data) => {
        console.log(`sent: ${data.message}`);
        io.emit("receive_message", data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});
