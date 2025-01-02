import Message from './models/Message.js';
import db from './config/db.js';


const socketHandlers = (io) => {
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
        });
    
        socket.on('add_user', async ({ msg }) => {
            await db.saveMessage(msg);
            socket.emit('added_used', msg);
        });
    
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
}

export default socketHandlers;