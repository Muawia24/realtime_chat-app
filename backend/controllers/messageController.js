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
}