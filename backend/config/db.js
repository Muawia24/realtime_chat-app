import mongoose from 'mongoose';
import Message from '../models/Message.js';

class DB {
    async connect() {
        console.log('Hiiiiii');
        try {
            await mongoose.connect(process.env.MONGO_URI, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true 
            });
            console.log('MongoDB connected!');
        } catch (error) {
            console.error('MongoDB connection failed:', error.message);
            process.exit(1);
        }
    }

    async saveMessage(data) {
        const newMessage = new Message(
            {
                sender: data.senderId,
                content: data.content,
                room: data.room
            }
        );
        await newMessage.save();
    }
}

const db = new DB();

export default db; 