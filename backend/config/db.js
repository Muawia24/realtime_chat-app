import mongoose from 'mongoose';
import Message from '../models/Message';

class DB {
    async connect() {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected!'))
        .catch((error) => {
            console.error('MongoDB Connection Failed:', error.message);
            process.exit(1);
        });
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

export default DB; 