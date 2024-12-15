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
app.use(cors);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.status(200).send('Backend running...')
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});
