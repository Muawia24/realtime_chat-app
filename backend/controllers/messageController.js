import Message from "../models/Message.js";
import ChatRoom from "../models/ChatRoom.js";
import User from "../models/User.js";

export default class MessageController {
    static async newRoom(req, res) {
        try {
            const { name } = req.body;

            const existingRoom = await ChatRoom.findOne({ name });
            if (existingRoom) {
                return res.status(400).json({ message: 'Chat room already exists' });
            }

            const newRoom = new ChatRoom({
                name,
                users: req.user._id,
                admin: req.user._id,
            });
            const savedRoom = await newRoom.save();
            return res.status(201).json(savedRoom);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create chat room'});
        }
    }

    static async getUserRooms (req, res) {
        try {
            const userId = req.user._id;
            const userRooms = await ChatRoom.find({ users: userId });

            return res.status(200).json(userRooms);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to user rooms'});   
        }
    }

    static async addUserToRoom(req, res) {
        const { roomName }  = req.params;
        const { userId } = req.body;

        try {
            const room = await ChatRoom.findOne({ name: roomName });
            const newUser = await User.findOne({ _id: userId });
            if (!newUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (room.users.includes(userId)) {
                return res.status(400).json({ message: 'User is already in the chatroom' });
            }
            room.users.push(userId);
            await room.save();

            return res.status(200).json({ message: 'User added to room', newUser });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Failed to update room members'});
        }

    }

    static async getRoom(req, res) {
        try {
            const room = await ChatRoom.findOne({ name: req.params.roomName }).select('admin name users');
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            return res.status(200).json(room);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }

    static async removeUserInRoom (req, res) {
        const { userId } = req.body;

        try {
            const room = await ChatRoom.findOne({ name: req.params.roomName });
            console.log('heeere');
            console.log(room);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            // Ensure the user is actually in the room
            if (!room.users.includes(userId)) {
                return res.status(400).json({ message: 'User is not in the room' });
            }

            // Remove the user from the room
            room.users = room.users.filter((id) => id.toString() !== userId);
            await room.save();

            res.status(200).json({ message: 'User removed from room', userId });
        } catch (error) {
            console.error('Error removing user from room:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async newMessage(req, res) {
        const { roomName } = req.params;
        const { sender, content, username } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            // Save the message to the database
            const message = await Message.create({
                room: roomName,
                sender,
                username,
                content,
                fileUrl,
                timestamp: new Date(),
            });

           return res.status(201).json(message);
        } catch (error) {
            console.error('Error saving message:', error);
            return res.status(500).json({ error: 'Failed to save message' });
        }
    }

    static async messageDelete(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user._id; // Get the logged-in user's ID
    
            // Find the message
            const message = await Message.findOne({ _id: messageId });
            console.log('here', message);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
    
            // Ensure the user is either the sender or an admin of the room
            const room = await ChatRoom.findOne({ name: message.room });
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
    
            if (room.admin.toString() !== userId.toString()) {
                return res.status(403).json({ message: 'You do not have permission to delete this message' });
            }
    
            // Delete the message
            await message.deleteOne();
            res.status(200).json({ message: 'Message deleted successfully', messageId });
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async exitRoom(req, res) {
        const { roomName } = req.params;
        const { userId } = req.body;

        try {
            // Find the chatroom and update the members list
            const room = await ChatRoom.findOneAndUpdate(
                { name: roomName },
                { $pull: { users: userId } }, // Remove the user from the members array
                { new: true }
            );
            console.log(room);

            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }

            return res.status(200).json({ message: 'Exited room successfully', room });
        } catch (error) {
            console.error('Error exiting room:', error);
            return res.status(500).json({ message: 'Failed to exit the room' });
        }
    }
}